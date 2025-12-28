#login.db <-> CompanyUsers.db
#ComapnyUsers.db <-> CompanyUser.jsx
import sqlite3 as sq 
from flask import Blueprint,jsonify
import os
from tkinter import messagebox as mb
users = Blueprint('CentralUserBase',__name__,url_prefix='/api')

databaseDir = os.path.join(os.getcwd(),"src","Database")
CompanyUserPath = os.path.join(databaseDir,"CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir,"Credentials.db")

def createCompanyUsers():
    conn = sq.connect(CompanyUserPath)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # Use ATTACH to perform a cross-database JOIN
    cursor.execute(f"ATTACH DATABASE '{CredentialsPath}' AS cred_db")

    companyTable = """
    create table if not exists user(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth_id INTEGER NOT NULL unique,
    name TEXT NOT NULL,
    employeeId TEXT UNIQUE NOT NULL,
    department TEXT,
    status TEXT DEFAULT 'Logged Out',
    lastLogin TEXT,
    FOREIGN KEY (auth_id) REFERENCES cred_db.login(id)
    """
    cursor.execute(companyTable) 
    conn.commit()
    conn.close()

def fetchCompanyUserValues():
    conn = sq.connect(CompanyUserPath)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # Use ATTACH to perform a cross-database JOIN
    cursor.execute(f"ATTACH DATABASE '{CredentialsPath}' AS cred_db")

    query = """
    select emp.name, emp.employeeId, emp.department, emp.status, emp.lastLogin, 
    login.role, login.gender, login.phoneNumber 
    from user as emp
    join cred_db.login as login ON emp.auth_id = login.id 
    """
    cursor.execute(query)
    conn.commit()
    CompanyUsers = cursor.fetchall()
    conn.close()
    return CompanyUsers

@users.route("/getCompanyUsers",methods=['GET'])
def getCompanyUserValues():
    try:
        fetchedData = fetchCompanyUserValues()
        # Convert the list of tuples from SQL into a list of JSON objects
        result = []

        for row in fetchedData:
            result.append({"name":row[0],"employeeId": row[1],"department": row[2],"status": row[3],"lastLogin": row[4],"role": row[5],"gender": row[6],"phoneNumber": row[7]})

        print("getCompanyUserValues:",result[-1])
        return jsonify(result),200
    except sq.DataError as de:
        mb.showerror(de)
        return jsonify({"error": str(de)}), 500 # Added return on error
    