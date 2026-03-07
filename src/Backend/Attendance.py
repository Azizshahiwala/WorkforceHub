# src/Database/Attendance.py
from flask import Blueprint, jsonify
from flask import request as rq
from datetime import datetime, date
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
            paidleave BOOLEAN NOT NULL Default 'False',
            isHoliday BOOLEAN NOT NULL Default 'False',
            FOREIGN KEY (empId) REFERENCES user(employeeId) ON DELETE CASCADE,
            UNIQUE(empId, date)
            

        );            
        """
        cursor.execute(query)
        conn.commit()
        conn.close()

    def fetch_leave_data(self):
        conn, cursor = self._get_connection()
        query = """
    SELECT DISTINCT
        emp.lastLogin, emp.employeeId, emp.name, 
        att.date, login.role, att.status, att.leaveDuration,att.isHoliday 
    FROM Attendance att
    LEFT JOIN "user" as emp ON att.empId = emp.employeeId
    LEFT JOIN cred_db.login as login ON emp.auth_id = login.id
    GROUP BY emp.employeeId, att.date 
    ORDER BY att.date DESC, emp.name ASC
    """
        cursor.execute(query)
        data = cursor.fetchall()
        if not data:
            conn.close()
            return jsonify({"Error":"Table view error. No data found."}), 404
        
        conn.close()
        return data if data else []

    def fetch_dashboard_data(self):
        conn, cursor = self._get_connection()
        query = """
        SELECT 
            emp.lastLogin, emp.employeeId, emp.name, 
            att.date, login.role, att.status,att.leaveDuration, att.isHoliday 
        FROM Attendance att
        LEFT JOIN "user" as emp ON att.empId = emp.employeeId
        LEFT JOIN cred_db.login as login ON emp.auth_id = login.id
        """
        cursor.execute(query)
        data = cursor.fetchall()

        if not data:
            conn.close()
            return jsonify({"Error":"Table view error. No data found."}), 404
        
        conn.close()
        return data if data else []
    def clean_entries(self,empID):
        #This function will clean a month data upon request. not automatic.
        pass

    def SetupFutureHoliday(self,currDate,mode):
        try:
            conn,cursor = self._get_connection()
            
            cursor.execute('SELECT distinct employeeId FROM "user"')
            employees = cursor.fetchall()
            if employees and mode == "set":
                #Pre-process data before reaching UI. this prevents stacking of labels.
                batch = [(emp[0],currDate,'Absent','True') for emp in employees]
                cursor.executemany("INSERT OR IGNORE INTO Attendance(empId, date, status,isHoliday) VALUES(?, ?, ?, ?)",
                batch)
            else:
                cursor.execute("UPDATE Attendance SET isHoliday = 'False' WHERE date = ?", (currDate,))
                return jsonify({"status":"error","message":"Could not retrive data. User database seems empty."}),400
            
            conn.commit()
            conn.close()
            return jsonify({"status":"success","message":"New batch of entries is filled."}),200

        except Exception as e:
            print(e)
            return jsonify({"status":"error","message":str(e)})
        
attendance_manager = AttendanceDB(CompanyUserPath, CredentialsPath)

def createAttendance():
    attendance_manager.create_table()

#Used by attendanceDashboard.
@attendance.route("/fetchdashboard", methods=['GET'])
def get_attendance_dashboard():
    try:
        data = attendance_manager.fetch_dashboard_data()
        result = [
            {
                "lastLogin": r[0], "empId": r[1], "name": r[2], 
                "date": r[3], "role": r[4], "status": r[5],"leaveDuration": r[6],"isHoliday": r[7]
            } for r in data
        ]
        #print("[====fetchdashboard====]",result[0])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

#This route wil be used from attendance overview and update original attendance table.
#sets 'leave' in main att table to the block which has been set 'Holiday' 
@attendance.route("/updateglobalLeave/<string:mode>", methods=['POST','GET'])
def updateGlobalLeave(mode):
    data= rq.get_json()
    
    currentDate = data.get("currDate")

    if mode not in ["set","remove"] or currentDate == "":
        return jsonify({"status":"error","message":"Un-identified error occurred. Cannot process leave"}),400
    
    try:
        conn, cursor = attendance_manager._get_connection()
        
        if mode == 'set':
            #Check if entry does not exist
                cursor.execute('SELECT count(empId) FROM attendance where date=?',(currentDate,))
                if cursor.fetchone()[0] == 0:
                    attendance_manager.SetupFutureHoliday(currentDate,mode)
                else:
                    # Set status to 'Leave' and isHoliday to 'True'
                    cursor.execute("""
                        UPDATE Attendance set
                        isHoliday = 'True' 
                        WHERE date = ? AND paidleave <> 'True'""", (currentDate,))
        else:
            # Revert isHoliday and status
            cursor.execute("""
                UPDATE Attendance set
                isHoliday = 'False' 
                WHERE date = ? AND paidleave <> 'True'""", (currentDate,))
        conn.commit()
        conn.close()
        return jsonify({"status":"success","message":"Leave status updated"}),200     
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}),400  
    finally:
        if 'conn' in locals() and conn:
            conn.close()

#Used by attendanceOverview.
@attendance.route("/fetchOverview", methods=['GET'])
def get_attendance_overview():
    try:
        data = attendance_manager.fetch_leave_data()
        result = [
            {
                "lastLogin": r[0], "empId": r[1], "name": r[2], 
                "date": r[3], "role": r[4], "status": r[5],"leaveDuration": r[6], "isHoliday":r[7]
            } for r in data
        ]
        #print("[====fetchOverview====]",result[0])
        return jsonify(result), 200   
    except Exception as e:
        return jsonify({"status":"error","message":{str(e)}}),400  
    
@attendance.route("/attendance/entrysetup",methods=['GET'])
def entrysetup():
    try:
        conn,cursor = attendance_manager._get_connection()
        today = datetime.now().strftime("%Y-%m-%d")
        cursor.execute('SELECT distinct employeeId FROM "user"')
        employees = cursor.fetchall()
        if employees:
            #Pre-process data before reaching UI. this prevents stacking of labels.
            batch = [(emp[0],today,'Absent') for emp in employees]
            cursor.executemany("INSERT OR IGNORE INTO Attendance(empId, date, status) VALUES(?, ?, ?)",
            batch)
        else:
            return jsonify({"status":"error","message":"Could not retrive data. User database seems empty."}),400
        
        conn.commit()
        conn.close()
        return jsonify({"status":"success","message":"New batch of entries is filled."}),200

    except Exception as e:
        print(e)
        return jsonify({"status":"error","message":str(e)})