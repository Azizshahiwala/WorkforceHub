#Uses existing company users. it has a table: attendance
#Fetches the following from UserDashboard: Last login , empId, name,date , role and status

from flask import request as rq, Blueprint, jsonify
import os 
import sqlite3 as sq
from tkinter import messagebox as mb

attendance = Blueprint('Attendance',__name__,url_prefix='/api')
@attendance.route("/att-dashboard",methods=['GET'])
def createAttendance():
    try:
        """
        Docstring for createAttendance
        We use credentials.db because it has email and password. it will be used to
        validate if the person is authentic. and assign status according to it.

        We need companyUser.db because it has important stuff such as : status,empID,role, department, gender.
        this way we can link them and generate more filtered data.
        """
        databaseDir = os.path.join(os.getcwd(), "src", "Database")
        CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
        CredentialsPath = os.path.join(databaseDir, "Credentials.db")
            
        if os.path.exists(CompanyUserPath):
            #Connect to database
            conn = sq.connect(CompanyUserPath)
            conn.execute("PRAGMA foreign_keys = ON;")
            #Create cursor
            cursor = conn.cursor()
            
            AttendanceTable = """
    create table if not exists Attendance(id integer primary key autoincrement,
    empId text not null,
    date text not null,
    status text not null,
    FOREIGN KEY (empId) references user(employeeId));            
"""
            cursor.execute(AttendanceTable)
            conn.commit()
            cursor.execute(f"ATTACH DATABASE '{CredentialsPath}' AS cred_db")
            # 3. Fetch: Last login, empId, name, date, role, and status
            # Joining 'user' (emp), 'attendance' (att), and 'login' (login)
            query = """
    SELECT 
        emp.lastLogin,    -- index 0
        emp.employeeId,   -- index 1 (empId)
        emp.name,         -- index 2
        att.date,         -- index 3
        login.role,       -- index 4 (role)
        att.status        -- index 5
    FROM Attendance att
    JOIN user as emp ON att.empId = emp.employeeId
    JOIN cred_db.login as login ON emp.auth_id = login.id
    """
            cursor.execute(query)
            conn.commit()
            attData = cursor.fetchall()
            JsonResult = []
            for row in attData:
                JsonResult.append({"lastLogin": row[0],"empId": row[1],"name": row[2],"date": row[3],"role": row[4],"status": row[5]})
            
            print("Create attendance: ",JsonResult[-1])
            return jsonify(JsonResult),200
        else:
            mb.showwarning(message="Warning: CompanyUser.db not found.") 
            return jsonify({"message":"Warning: CompanyUser.db not found"}),200
    except sq.DatabaseError as dber:
        mb.showerror(message=f"Attendance.py: src/Database/ not found: {dber}")
        return jsonify({"message":"Warning:Folder not found"}),500