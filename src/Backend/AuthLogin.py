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

@authlogin.route("/Login", methods=['POST'])
def login():
    try:
        data = rq.get_json()
        email = data.get("email")
        password = data.get("password")
        
        print(f"🔍 Login attempt: {email}")
        
        conn = sq.connect(databasePath)
        cursor = conn.cursor()
        cursor.execute("SELECT role FROM login WHERE email = ? AND password = ?", (email, password))
        role_data = cursor.fetchone()
        conn.close()
        
        if role_data:
            role = role_data[0]
            print(f"✅ User found - Role: '{role}'")  # ← CRITICAL DEBUG
            
            role_lower = role.lower().strip()
            
            if isNonStaff(role):
                print("✅ → Non-Staff (Permission 1)")
                return jsonify({"success": True, "role": role, "message": "Success", "Permission": 1}), 200
            elif isStaff(role):
                print("✅ → Staff (Permission 2)")
                return jsonify({"success": True, "role": role, "message": "Success", "Permission": 2}), 200
            elif isEmployee(role):
                print("✅ → Employee (Permission 3)")
                return jsonify({"success": True, "role": role, "message": "Success", "Permission": 3}), 200
            else:
                print(f"❌ Role '{role}' not recognized")
                return jsonify({"success": False, "role": "", "message": "Role not recognized", "Permission": 0}), 200
        else:
            print(f"❌ No user found for {email}")
            return jsonify({"success": False, "role": "", "message": "Invalid credentials"}), 200
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({"success": False, "role": "", "message": str(e)}), 500
# ===============================   
# ATTENDANCE GENERATOR
