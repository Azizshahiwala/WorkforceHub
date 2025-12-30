# src/Database/Users.py
import sqlite3 as sq 
from flask import Blueprint, jsonify
import os

users = Blueprint('CentralUserBase', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")

class UserDB:
    def __init__(self, db_path, cred_path):
        self.db_path = db_path
        self.cred_path = cred_path

    def _get_connection(self):
        conn = sq.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        return conn, cursor

    def create_table(self):
        conn, cursor = self._get_connection()
        query = """
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            auth_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            employeeId TEXT UNIQUE NOT NULL,
            department TEXT,
            status TEXT DEFAULT 'Logged Out',
            lastLogin TEXT,
            BaseSalary REAL DEFAULT 0.0
            -- Note: Cross-db foreign keys are logical only in SQLite
        );
        """
        cursor.execute(query)
        conn.commit()
        conn.close()

    def fetch_all_with_credentials(self):
        conn, cursor = self._get_connection()
        query = """
   SELECT emp.name, emp.employeeId, emp.department, emp.status, emp.lastLogin, 
   login.role, login.gender, login.phoneNumber, emp.BaseSalary 
   FROM user AS emp 
   JOIN cred_db.login AS login ON emp.auth_id = login.id
    """
        cursor.execute(query)
        data = cursor.fetchall()
        conn.close()
        return data

# Instantiate the object
user_manager = UserDB(CompanyUserPath, CredentialsPath)

def createCompanyUsers():
    user_manager.create_table()

@users.route("/getCompanyUsers", methods=['GET'])
def get_company_users():
    try:
        data = user_manager.fetch_all_with_credentials()
        result = [
            {
                "name": r[0], "employeeId": r[1], "department": r[2], 
                "status": r[3], "lastLogin": r[4], "role": r[5], 
                "gender": r[6], "phoneNumber": r[7],"BaseSalary": r[8]
            } for r in data
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500