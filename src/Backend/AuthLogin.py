from flask import request as rq
from flask import Blueprint, jsonify, session
import random
import sqlite3 as sq
from datetime import datetime
from Core.EmailService import emailService
from Notification import notifManager
from PathConfig import CompanyUserPath,CredentialsPath
from Encrypter import encrypter
#We use env file to get dynamic environment names
#This prevents database data breach

def createCredentials():
    conn = None
    try:
        conn = sq.connect(CredentialsPath)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS login(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            gender TEXT NOT NULL,
            phoneNumber TEXT NOT NULL UNIQUE,
            OTP INTEGER NULL,
            OTP_TIMESTAMP TEXT NULL
        );
        ''')
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return False
    finally:
        if conn:
            conn.close() 

def isStaff(role):
    staff = ["Sales manager", "Designer", "Developer", 
    "Marketing",  "Finance"]
    
    # for security check, we trim and lower the string.
    # and then we compare role with individual staff.
    staffmap = [item.strip().lower() == role.strip().lower() for item in staff]

    #Map How much roles match as boolean values and use any() to check that
    #ANY ONE value should be true.
    if any(staffmap):
        return True
    
    return False
def isNonStaff(role):
    nonstaff = ["Admin", "CEO", "HR"]
    nonstaffmap = [item.strip().lower() == role.strip().lower() for item in nonstaff]
    
    if any(nonstaffmap):
        return True
    
    return False
def isEmployee(role):
    employee = ["Intern", "Tester", "Support"]
    
    employeemap = [item.strip().lower() == role.strip().lower() for item in employee]

    if any(employeemap):
        return True
    
    return False
authlogin = Blueprint('Auth',__name__,url_prefix='/api')
class Login:
    def __init__(self,cred_path,comp_path):
        self.cred_path = cred_path
        self.comp_path = comp_path
    def _conn_get(self):
        conn = sq.connect(self.cred_path)
        cursor = conn.cursor()
        
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor.execute(f"ATTACH DATABASE '{self.comp_path}' AS emp")
        return conn, cursor
        
@authlogin.route("/Login", methods=['POST'])
def login():
    conn = None
    try:
        data = rq.get_json()
        email = data.get("email")
        password = data.get("password")

        conn = sq.connect(CredentialsPath)
        cursor = conn.cursor()

        #To support indiviual user login, we use user table.
        cursor.execute(f"ATTACH DATABASE '{CompanyUserPath}' AS profile")

        #Step 1: Check for email first. also fetch password for next step
        cursor.execute(
            """SELECT login.role, 'user'.name, 'user'.employeeId, login.email, login.id, login.password
               FROM login
               left join profile.user 'user' on login.id = user.auth_id 
               where login.email = ?""", (email,))
        
        user_info = cursor.fetchone()
        conn.close()
        
        #If data found, fetch data.
        if user_info:
            
            role, name, employeeId, email, id, stored_hash = user_info  
             
            #Now you verify hash passwords. string with another string.
            if encrypter.verify_hash(password,stored_hash):
                permission = 0  
                if isNonStaff(role):
                    permission = 1
                elif isStaff(role):
                    permission = 2
                elif isEmployee(role):
                    permission = 3
                else:
                    permission = 0

                session['permission'] = permission
                session['role'] = role 
                session['name'] = name 
                session['email'] = email
                session['employeeId'] = employeeId
                session['id'] = str(id) 
                session['status'] = "Logged In"
                
                # Update status and lastLogin
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M %p")
                current_date = datetime.now().strftime("%Y-%m-%d")
                update_conn = sq.connect(CompanyUserPath)
                update_cursor = update_conn.cursor()
                update_cursor.execute("""
                    UPDATE user SET status = 'Logged In', lastLogin = ? WHERE employeeId = ?
                """, (current_time, employeeId))
                
                # Insert attendance record if not exists for today
                update_cursor.execute("""
                    SELECT id FROM Attendance WHERE empId = ? AND date = ?
                """, (employeeId, current_date))
                existing = update_cursor.fetchone()
                if not existing:
                    update_cursor.execute("""
                        INSERT INTO Attendance (empId, date, status) VALUES (?, ?, 'Present')
                    """, (employeeId, current_date))
                
                update_conn.commit()
                update_conn.close()

                return jsonify({
                "success": True,
                "Permission": session['permission'],
                "role": session['role'],
                "name": session['name'],
                "id":session['id'],
                "employeeId": session['employeeId'],
                "email": session['email'],
                "message": "Login successful",
                "status": session['status']
                    }), 200
        else:
            return jsonify({"success": False,"message": "Invalid credentials"}), 200
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"success": False,"message": str(e)}), 500
    finally:
        if conn:
            conn.close()

LoginHandler = Login(CredentialsPath,CompanyUserPath)
@authlogin.route("/deleteAccount/<string:auth_id>", methods=['POST'])
def deleteAccount(auth_id):
    conn = None
    try:
        role = session.get('role')
        permission = session.get('permission')

        if 'role' not in session or 'permission' not in session:
            print("Role : ",role)
            print("Permission : ",permission)
            return jsonify({"status":"error"}),500
        
        if not isNonStaff(role) or not (permission == 1):
            print("Role : ",role)
            print("Permission : ",permission)
            return jsonify({"status":"error"}),401

        conn,cursor = LoginHandler._conn_get()

        cursor.execute("select name FROM emp.'user' WHERE auth_id = ?",(auth_id,))
        name = cursor.fetchone()

        #Using the rule of on delete cascade, IF auth_id from user is deleted, 
        #ALL the user database table using the cascade will automatically delete the row containing matching empid.
        #Hence i do not need to use JOIN
        cursor.execute("DELETE FROM emp.'user' WHERE auth_id = ?", (auth_id,))
        
        #But login table is in credentials db. so i need to delete this manually. delete cascade does not support cross conn.
        cursor.execute("DELETE FROM login WHERE id = ?", (auth_id,))
        
        conn.commit()

        conn.close()
        notifManager.insert_notification(message=f"User {name} has been removed, and will no longer work from today with us.. ",isGlobal=True)
        return jsonify({"status":"success","message":"Account removed successfully"}),200
    except Exception as e:
        print(e)
        return jsonify({"error":str(e)}),500
    finally:
        if conn:
            conn.close()

@authlogin.route("/updatePassByHR/<string:auth_id>", methods=['POST'])
def updatePassByHR(auth_id):
    conn = None 
    try:

        role = session.get('role')
        permission = session.get('permission')

        if 'role' not in session or 'permission' not in session:
            print("Role : ",role)
            print("Permission : ",permission)
            return jsonify({"status":"error"}),500
        
        if not isNonStaff(role) or not (permission == 1):
            print("Role : ",role)
            print("Permission : ",permission)
            return jsonify({"status":"error"}),401
        
        conn,cursor = LoginHandler._conn_get()

        #Fetch data
        getData = rq.get_json()
        newPassword = encrypter.create_hash(getData.get("tempPass"))

        #Update placeholder data
        cursor.execute("update login set password = ? where id = ?",(newPassword,auth_id,))

        #Set status as Logged Out to remove the btn from frontend.
        cursor.execute("UPDATE emp.'user' SET status = 'Logged Out' WHERE auth_id = ?", (auth_id,))
        conn.commit()

        #Now to insert notification, i need empID, role and msg
        cursor.execute("""select login.role, emp.employeeId from login
                       left join emp.'user' as emp on login.id = emp.auth_id
                       where login.id = ? """,(auth_id,))
        
        data = cursor.fetchone()
        
        if data:
            #Create a notification for user.
            notifManager.insert_notification(role=data[0],employeeId=data[1],message=f"Your password has been updated by HR. New pass: {newPassword}")

        conn.close()
        #Create a json result
        return jsonify({"status":"success","message":"Password successfully updated. Reload the page."}),200
    except Exception as e:
        print(e)
        return jsonify({"status":"error","message":"ID couldn't be processed. Re-start application."}),404
    finally:
        if conn:
            conn.close()
@authlogin.route("/TabCloseLogout", methods=['POST'])
def TabCloseLogout():
    try:
        if 'employeeId' not in session:
            return jsonify({"error": "unauthorized"}), 401
        
        conn = sq.connect(CompanyUserPath)
        cursor = conn.cursor()

        # Update status to Logged Out
        empId = session.get('employeeId') 
         
        cursor.execute("""
            UPDATE user SET status = 'Logged Out' WHERE employeeId = ?
        """, (empId,))
        
        session.clear()
        conn.commit()
        conn.close()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 
@authlogin.route('/Forgotpassword-process',methods=['POST'])
def ForgotpasswordPhase1():
    try:
        conn = sq.connect(CredentialsPath)
        cursor = conn.cursor()
        reqEmail = rq.form.get('email')
        cursor.execute("select id from login where email = ?",(reqEmail,))
        
        FetchedId = cursor.fetchone()
        if FetchedId[0]:
            OTP = random.randint(100000,999999)
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("UPDATE login SET OTP = ?, OTP_TIMESTAMP=? WHERE email = ?", (OTP,timestamp, reqEmail,))
            conn.commit()
            
            subject = "Your Password Reset Code"
            body = f"Your verification code is: {OTP}. It expires in 2 minutes."
            emailService.send_email(emailService.username, reqEmail, subject, body)

            return jsonify({"success": True, "message":"Email sent to your mail box.", "forId":FetchedId[0]}), 200
        
        return jsonify({"success": False, "message":"Email not found. make sure you typed the email correctly.","forId":None}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.commit()
            conn.close()

@authlogin.route('/getserverOTP',methods=['GET','POST'])
def ForgotpasswordPhase2():
    try:
        conn = sq.connect(CredentialsPath)
        cursor = conn.cursor()

        #Get id from server to compare.
        #Get current otp typed from frontend.
        data = rq.get_json()
        
        forid = data.get("forid")
        typed_otp = data.get("currentotp")

        #Now get otp using forid:
        if forid:
            cursor.execute("select OTP,OTP_TIMESTAMP from login where id = ?",(forid,))
            record = cursor.fetchone()
           
            #Now get otp and compare:
            
            if record[0] and record:
                #Clear the otp
                serverotp = record[0]
                stored_time = datetime.strptime(record[1], "%Y-%m-%d %H:%M:%S")
                
                # Calculate time difference
                time_diff = datetime.now() - stored_time
                seconds_passed = time_diff.total_seconds()
                if serverotp == typed_otp and seconds_passed <= 120:  
                    cursor.execute("UPDATE login SET OTP = NULL,OTP_TIMESTAMP = NULL WHERE id = ?",(forid,))
                    return jsonify({"success": True, "message":"OTP matched successfully."}), 200
                elif seconds_passed > 120:
                    cursor.execute("UPDATE login SET OTP = NULL,OTP_TIMESTAMP = NULL WHERE id = ?",(forid,))
                    return jsonify({"success": False, "message":"OTP time out."}), 200
    
        return jsonify({"success": False, "message":"OTP incorrect."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.commit()
            conn.close()
@authlogin.route('/finalize-password-updation',methods=['POST'])
def ForgotpasswordPhase3():
    try:
        conn = sq.connect(CredentialsPath)
        cursor = conn.cursor()

        data = rq.get_json()
        
        finalPassword = data.get("finalPassword")
        email = data.get("email")

        if len(finalPassword) <= 8:
            return jsonify({"success": "Retry", "message":"Successfully updated password."}), 200

        hashed = encrypter.create_hash(finalPassword)

        #Update password
        cursor.execute("UPDATE login SET password = ? WHERE email = ?",(hashed,email,))

        #Clear the otp
        cursor.execute("UPDATE login SET OTP = NULL WHERE email = ?",(email,))

        return jsonify({"success": True, "message":"Successfully updated password."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.commit()
            conn.close()