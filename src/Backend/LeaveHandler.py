from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
from datetime import datetime, date, time, timezone
leaveManager = Blueprint('Leave', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
class LeaveHandler:
    def __init__(self, compUser_path, cred_path):
        self.compUser_path = compUser_path
        self.cred_path = cred_path

    def _get_connection(self):
        conn = sq.connect(self.compUser_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        return conn, cursor

    def create_tables(self):
        conn, cursor = self._get_connection()
        query = """
        CREATE TABLE IF NOT EXISTS IncomingLeaves(
            Leaveid INTEGER PRIMARY KEY AUTOINCREMENT,
            auth_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            employeeId TEXT NOT NULL,
            department TEXT,
            startdate TEXT not null,
            enddate TEXT not null,
            reason TEXT not null,
            status TEXT default 'Not reviewed.',
            dateSubmitted TEXT not null
        );
        """
        cursor.execute(query)

        query = """
        CREATE TABLE IF NOT EXISTS LiveLeaves(
            Leaveid INTEGER PRIMARY KEY,
            auth_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            employeeId TEXT NOT NULL,
            department TEXT,
            startdate TEXT not null,
            enddate TEXT not null,
            reason TEXT not null,
            status TEXT not null,
            dateSubmitted TEXT not null
        );
        """
        cursor.execute(query)

        conn.commit()
        conn.close()
    def createLeaveRq(self,name,department,startdate,enddate,reason,dateSubmitted,empId,auth_id):
        
        try:
            conn,cursor = self._get_connection()

            query = """
            INSERT INTO IncomingLeaves(auth_id, name, employeeId, department,startdate, enddate, reason, dateSubmitted)
            VALUES (?,?,?,?,?,?,?,?);
            """     
            cursor.execute(query,(auth_id,name,empId,department,startdate,enddate,reason,dateSubmitted,))
            conn.commit()
            conn.close()
            return "success"
        except Exception as e:
            print("Error createLeaverq",e)
            return "error"
    def fetchData(self,Leaveid):
        try:
            conn,cursor = self._get_connection()

            query = """
            select * from IncomingLeaves where Leaveid = ?;
            """     
            cursor.execute(query,(Leaveid,))
            res = cursor.fetchone()
            conn.close()    
            print(res)
            return res
        except Exception as e:
            print("Error createLeaverq",e)
            return jsonify(e)
    
    def LeavesChecker(self):
        conn, cursor = self._get_connection()
        today = date.today()

        cursor.execute("""
            SELECT Leaveid, enddate
            FROM LiveLeaves
            WHERE status = 'Active'
        """)

        activeLeaves = cursor.fetchall()
        closedCount = 0

        for leave in activeLeaves:
            leaveId = leave[0]
            enddate_str = leave[1]  # ← THIS is enddate_str

            enddate = datetime.strptime(enddate_str, "%Y-%m-%d").date()

            # 🔑 Rule: close if today is enddate OR passed
            if today >= enddate:
                cursor.execute("""
                    UPDATE LiveLeaves
                    SET status = 'Completed'
                    WHERE Leaveid = ?
                """, (leaveId,))
                closedCount += 1

        conn.commit()
        conn.close()
        return closedCount
leavehandler = LeaveHandler(CompanyUserPath,CredentialsPath)

def createLeave():
    leavehandler.create_tables()


@leaveManager.route('/fetchAllRq/',methods=['GET'])
def FetchAllLeaves():
    try:
        conn, cursor = leavehandler._get_connection()
        allEmployeesQ = """
        select Leaveid, auth_id, name, employeeId, department, startdate, enddate, reason, dateSubmitted from IncomingLeaves;
        """
        cursor.execute(allEmployeesQ)
        fetchedEmployees = cursor.fetchall()

        result = []
        for r in fetchedEmployees:
            result.append({
                "Leaveid": r[0],
                "auth_id": r[1],
                "name": r[2],
                "employeeId": r[3],
                "department": r[4],
                "startdate": r[5],
                "enddate": r[6],
                "reason": r[7],
                "dateSubmitted": r[8]
            })
        conn.close()

        return jsonify(result) ,200
    except Exception as e:
        print(e)
        return jsonify({"status":"error"}) ,500

@leaveManager.route('/postLeaveRq/<string:empId>/<string:auth_id>',methods=['POST'])
def PostLeave(empId,auth_id):
    data = rq.get_json()

    name = data.get('name')
    department = data.get('department')
    startdate = data.get('startDate')
    enddate = data.get('endDate')
    reason = data.get('reason')
    dateSubmitted = data.get('dateSubmitted')
    try:
        print(startdate,enddate)
        start = datetime.strptime(startdate, "%Y-%m-%d").date()
        end = datetime.strptime(enddate, "%Y-%m-%d").date()
        
        if reason == "":
            return jsonify({"message":"Reason not given. ","status":"reason not provided"})
        
        if end < start:
            return jsonify({"message":"Invalid structure. ","status":"datetime compare error"})

        status = leavehandler.createLeaveRq(name,department,startdate,enddate,reason,dateSubmitted,empId,auth_id)
        return jsonify({"message":"Leave request sent successfully.","status":status})
        
    except Exception as e:
        print(e)
        return jsonify({"message":f"{e}","status":"error"})

    #When leave application is created, store it in incomingLeaves (yet to accept). 
    

@leaveManager.route('/acceptLeave/<string:leaveID>',methods=['POST'])
def AcceptLeave(leaveID):
    #When leave application is accepted,
    #Remove from incomingLeaves
    #Transfer to LiveLeaves
    try:
        FetchedData = leavehandler.fetchData(leaveID)
        
        if not FetchedData:
            return jsonify({
                "message": "Leave request not found or already processed.",
                "status": "error"
            }), 404
        
        conn,cursor = leavehandler._get_connection()
        toLiveQuery = """
        INSERT INTO LiveLeaves(
            LeaveId, auth_id, name, employeeId, department,
            startdate, enddate, reason, status, dateSubmitted
        ) VALUES (?,?,?,?,?,?,?,?,?,?)
        """
        cursor.execute(toLiveQuery,(FetchedData[0],FetchedData[1],FetchedData[2],FetchedData[3],FetchedData[4],FetchedData[5],FetchedData[6],FetchedData[7],'Active',FetchedData[9]))   
        remQuery = """
        delete from IncomingLeaves where LeaveId = ? and employeeId = ?;
        """
        cursor.execute(remQuery,(FetchedData[0],FetchedData[3]))
        conn.commit()
        conn.close()
        return jsonify({"message":"Leave request approved.","status":"success"})
    except Exception as e:
        print(e)
        return jsonify({"message":f"{e}","status":"error"})
    

@leaveManager.route('/rejectLeave/<string:leaveID>',methods=['POST'])
def RejectLeave(leaveID):
    #When leave application is rejected,
    #Remove from incomingLeaves.
    try:
        FetchedData = leavehandler.fetchData(leaveID)

        if not FetchedData:
            return jsonify({
                "message": "Leave request not found or already processed.",
                "status": "error"
            }), 404
        
        conn,cursor = leavehandler._get_connection()
        remQuery = """
        delete from IncomingLeaves where LeaveId = ? and employeeId = ?;
        """
        cursor.execute(remQuery,(FetchedData[0],FetchedData[3]))
        conn.commit()
        conn.close()
        return jsonify({"message":"Leave request denied successfully.","status":"success"})
    except Exception as e:
        print(e)
        return jsonify({"message":f"{e}","status":"error"})
@leaveManager.route('/CloseLeaveDuration/',methods=['GET'])
def CloseLeaveDuration():
    closedCount = leavehandler.LeavesChecker()
    return jsonify({"closedCount": closedCount}), 200
    

    