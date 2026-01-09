from flask import request as rq
from flask import Blueprint, jsonify
import os
import sqlite3 as sq

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
databasePath = os.path.join(databaseDir,"Credentials.db")
#Returns: HOME/src/Database/Credentials.db

CompanyUserPath = os.path.join(databaseDir,"CompanyUsers.db")

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