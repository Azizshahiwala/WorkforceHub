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
    staff_roles = [
        "Sales manager", "Designer", "Developer", 
        "Marketing", "Finance", "Sales Manager"  # Added exact match
    ]
    print(f"🔍 Checking staff: '{role}'")  # DEBUG
    return any(item.lower().strip() == role.lower().strip() for item in staff_roles)

def isNonStaff(role):
    nonstaff = ["Admin", "CEO", "HR", "Interviewer"]
    return any(item.lower() == role.lower() for item in nonstaff)

def isEmployee(role):
    employee_roles = ["Intern", "Tester", "Support"]
    print(f"🔍 Checking employee: '{role}'")  # DEBUG
    return any(item.lower() == role.lower() for item in employee_roles)

authlogin = Blueprint('Auth', __name__, url_prefix='/api')
createCredentials()

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
