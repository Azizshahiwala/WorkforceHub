from flask import request as rq
from flask import Blueprint, jsonify
import os
import sqlite3 as sq
from datetime import datetime
from Notification import notifManager
from PathConfig import CompanyUserPath,CredentialsPath
from Encrypter import encrypter
#Instead of hardcoded paths, this will help in making it dynamic instead of hardcode
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
            phoneNumber TEXT NOT NULL UNIQUE
        );
        ''')
        conn.commit()
        conn.close()
        print("✅ Database ready")
        return True
    except Exception as e:
        print(f"❌ DB Error: {e}")
        return False
    finally:
        if conn:
            conn.close() # This runs even if the code crashes
# ✅ FIXED: Exact role names matching your DummyDataFiller
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
    nonstaff = ["Admin", "CEO", "HR","Interviewer"]
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
        
        #print(f"🔍 Login attempt: {email}")
        
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
                "Permission": permission,
                "role": role,
                "name": name,
                "id":id,
                "employeeId": employeeId,
                "email": email,
                "message": "Login successful"
            }), 200
        else:
            #print(f"❌ No user found for {email}")
            return jsonify({"success": False,"message": "Invalid credentials"}), 200
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"success": False,"message": str(e)}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes

LoginHandler = Login(CredentialsPath,CompanyUserPath)
@authlogin.route("/deleteAccount/<string:auth_id>", methods=['POST'])
def deleteAccount(auth_id):
    conn = None
    try:
        
        conn,cursor = LoginHandler._conn_get()
        #Using the rule of on delete cascade, IF auth_id from user is deleted, 
        #ALL the user database table using the cascade will automatically delete the row containing matching empid.
        #Hence i do not need to use JOIN
        cursor.execute("DELETE FROM emp.'user' WHERE auth_id = ?", (auth_id,))
        
        #But login table is in credentials db. so i need to delete this manually. delete cascade does not support cross conn.
        cursor.execute("DELETE FROM login WHERE id = ?", (auth_id,))
        
        conn.commit()

        cursor.execute("select name FROM emp.'user' WHERE auth_id = ?",(auth_id,))
        name = cursor.fetchone()

        conn.close()
        notifManager.insert_notification(message=f"User {name} has been removed, and will no longer work from today with us.. ",isGlobal=True)
        return jsonify({"status":"success"}),200
    except Exception as e:
        print(e)
        return jsonify({"status":"error"}),500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes

@authlogin.route("/updatePassByHR/<string:auth_id>", methods=['POST'])
def updatePassByHR(auth_id):
    conn = None 
    try:
        conn,cursor = LoginHandler._conn_get()

        #Fetch data
        getData = rq.get_json()
        newPassword = encrypter.create_hash(getData.get("tempPass"))

        #Update placeholder data
        cursor.execute("update login set password = ? where id = ?",(newPassword,auth_id,))

        #Set status as Logged out to remove the btn from frontend.
        cursor.execute("UPDATE emp.'user' SET status = 'Logged Out' WHERE auth_id = ?", (auth_id,))
        conn.commit()

        print("Notif from updatePassByHR - Authlogin.py:")
        #Now to insert notification, i need empID, role and msg
        cursor.execute("""select login.role, emp.employeeId from login
                       left join emp.'user' as emp on login.id = emp.auth_id
                       where login.id = ? """,(auth_id,))
        
        data = cursor.fetchone()
        print("Data found: ",data)

        if data:
            #Create a notification for user.
            notifManager.insert_notification(role=data[1],employeeId=data[0],message=f"Your password has been updated by HR. New pass: {newPassword}")

        conn.close()
        #Create a json result
        return jsonify({"status":"success","message":"Password successfully updated. Reload the page."}),200
    except Exception as e:
        print(e)
        return jsonify({"status":"error","message":"ID couldn't be processed. Re-start application."}),404
    finally:
        if conn:
            conn.close()