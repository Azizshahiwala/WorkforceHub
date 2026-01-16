from flask import request as rq
from flask import Blueprint, jsonify
import os
import sqlite3 as sq
from datetime import datetime

databaseDir = os.path.join(os.getcwd(), "src", "Database")
databasePath = os.path.join(databaseDir, "Credentials.db")

def createCredentials():
    try:
        os.makedirs(databaseDir, exist_ok=True)
        conn = sq.connect(databasePath)
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

#os.getcwd() Returns the current working directory
databaseDir = os.path.join(os.getcwd(),"src","Database")
#Returns: HOME/src/Database/
CredentialsPath = os.path.join(databaseDir,"Credentials.db")
#Returns: HOME/src/Database/Credentials.db
CompanyUserPath = os.path.join(databaseDir,"CompanyUsers.db")

class Login:
    def __init__(self,cred_path,comp_path):
        self.cred_path = cred_path
        self.comp_path = comp_path
    def _conn_get(self):
        conn = sq.connect(self.cred_path)
        cursor = conn.cursor()

        cursor.execute(f"ATTACH DATABASE '{self.comp_path}' AS emp")
        return conn, cursor 

@authlogin.route("/Login", methods=['POST'])
def login():
    try:
        data = rq.get_json()
        email = data.get("email")
        password = data.get("password")
        
        print(f"🔍 Login attempt: {email}")
        
        conn = sq.connect(databasePath)
        cursor = conn.cursor()

        #To support indiviual user login, we use user table.
        cursor.execute(f"ATTACH DATABASE '{CompanyUserPath}' AS profile")

        cursor.execute(
            """SELECT login.role, user.name, user.employeeId, login.email, login.id
               FROM login
               left join profile.user 'user' on login.id = user.auth_id 
               where login.email = ? and login.password = ?"""
            , (email, password))
        
        user_info = cursor.fetchone()
        conn.close()
        
        if user_info:
            role, name, employeeId, email, id = user_info  
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
            print(f"❌ No user found for {email}")
            return jsonify({"success": False,"message": "Invalid credentials"}), 200
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"success": False,"message": str(e)}), 500
    
LoginHandler = Login(CredentialsPath,CompanyUserPath)
@authlogin.route("/deleteAccount/<string:auth_id>", methods=['POST'])
def deleteAccount(auth_id):
    try:
        
        conn,cursor = LoginHandler._conn_get()
        delQuery = """delete from login where id in(
        select login.id from login
        inner join "user" as emp on login.id = emp.auth_id
        where emp.auth_id = ?
        ); """
        cursor.execute(delQuery,(auth_id,))
        data = cursor.fetchone()
        print(f"Deleted {auth_id}:",data)
        conn.commit()
        conn.close()
        return jsonify({"status":"success"}),200
    except Exception as e:
        print(e)