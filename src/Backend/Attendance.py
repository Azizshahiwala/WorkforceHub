# src/Database/Attendance.py
from flask import Blueprint, jsonify
import os 
import sqlite3 as sq
from PathConfig import CompanyUserPath,CredentialsPath
attendance = Blueprint('Attendance', __name__, url_prefix='/api')
class AttendanceDB:
    def __init__(self, comp_path, cred_path):
        self.comp_path = comp_path
        self.cred_path = cred_path

    def _get_connection(self):
        conn = sq.connect(self.comp_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        return conn, cursor

    def create_table(self):
        conn, cursor = self._get_connection()
        query = """
        CREATE TABLE IF NOT EXISTS Attendance(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empId TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            leaveDuration TEXT DEFAULT NULL, -- store start and end date of leave
            FOREIGN KEY (empId) REFERENCES user(employeeId) ON DELETE CASCADE
        );            
        """
        cursor.execute(query)
        conn.commit()
        conn.close()

    def fetch_dashboard_data(self):
        conn, cursor = self._get_connection()
        query = """
        SELECT 
            emp.lastLogin, emp.employeeId, emp.name, 
            att.date, login.role, att.status,att.leaveDuration 
        FROM Attendance att
        LEFT JOIN "user" as emp ON att.empId = emp.employeeId
        LEFT JOIN cred_db.login as login ON emp.auth_id = login.id
        """
        cursor.execute(query)
        data = cursor.fetchall()
        #print("Attendance.py: ",data)
        if not data:
            conn.close()
            return jsonify({"Error":"Table view error. No data found."}), 404
        
        conn.close()
        return data

# Instantiate the object
attendance_manager = AttendanceDB(CompanyUserPath, CredentialsPath)

def createAttendance():
    attendance_manager.create_table()

@attendance.route("/fetchdashboard", methods=['GET'])
def get_attendance_dashboard():
    try:
        data = attendance_manager.fetch_dashboard_data()
        result = [
            {
                "lastLogin": r[0], "empId": r[1], "name": r[2], 
                "date": r[3], "role": r[4], "status": r[5],"leaveDuration": r[6]
            } for r in data
        ]
        #print("Sample data from attendance.py: ",result)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
   