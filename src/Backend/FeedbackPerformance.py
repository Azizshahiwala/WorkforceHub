from flask import request as rq
from flask import Blueprint,jsonify,session
import sqlite3 as sq
from datetime import datetime
from PathConfig import CompanyUserPath,CredentialsPath,GlobalInfoPath
from Notification import notifManager
import traceback
#Feedback and performance are different.
#Ref: FeedbackEmployee.jsx, AdminFeedback.jsx, EmployeePerformance.jsx, FeedbackEmployee.jsx, Performance.jsx
feedbackandperformance = Blueprint('feedbackPerformance', __name__, url_prefix='/api')

class FeedbackPerformance:
    def __init__(self, compUser_path, cred_path, globalInfo_path):
        self.compUser_path = compUser_path
        self.cred_path = cred_path
        self.globalInfo_path = globalInfo_path

    def _conn_globalInfo(self):
        conn = sq.connect(self.globalInfo_path)
        cursor = conn.cursor()

        conn.execute("PRAGMA foreign_keys = ON;")
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        
        return conn, cursor

    def createfeedbackPerformance(self):
        conn,cursor = self._conn_globalInfo()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Performance(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empId TEXT NOT NULL,
                avgRating TEXT NOT NULL,
                finalComment INTEGER NOT NULL,
                period TEXT, -- "2026-Q1", "2026-01"
                calculatedAt TEXT NOT NULL
            )
        ''')

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Feedback(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empId TEXT NOT NULL,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        givenBy TEXT,
        createdAt TEXT NOT NULL
        );
        ''')
        conn.commit()
        conn.close()
    def _conn_comp(self):
        conn = sq.connect(self.cred_path)
        cursor = conn.cursor()
        
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor.execute(f"ATTACH DATABASE '{self.compUser_path}' AS emp")
        return conn, cursor
FP_Handler = FeedbackPerformance(CompanyUserPath,CredentialsPath,GlobalInfoPath)

def FeedbackPerformanceSetup():
    FP_Handler.createfeedbackPerformance()

@feedbackandperformance.route("/submitFeedback/<string:employeeId>",methods=['POST'])
def submitFeedBack(employeeId):

    
    if 'employeeId' not in session or int(session.get('permission', 0)) != 1:
        return jsonify({
                "message": "Un-authorized access. Process blocked.",
                "status": "error"}), 401
    try:
        data = rq.get_json()
    
        name = data.get("name")
        rating = data.get("rating")
        comment = data.get("comment")
        givenBy = session.get("name")
        createdAt = datetime.now()
        conn,cursor = FP_Handler._conn_globalInfo()

        # print("Session contents:", dict(session))
        # print("Feedback to: ",employeeId)
        # print("Name: ",name)
        # print("rating: ",rating)
        # print("givenBy: ",givenBy)
        cursor.execute("""
        insert into Feedback(empId, name, rating, comment, givenBy, createdAt) values(?,?,?,?,?,?);
                    """,(employeeId,name,rating,comment,givenBy,createdAt,))
        
        conn.commit()
        conn.close()

        conn,cursor = FP_Handler._conn_comp()
        cursor.execute("""select login.role, emp.employeeId from login
                        left join emp.'user' as emp on login.id = emp.auth_id
                        where emp.employeeId = ? """,(employeeId,))
        n = cursor.fetchone()
        notifManager.insert_notification(employeeId=n[1],role=n[0],message="Someone gave you a feedback!")
        
        conn.commit()
        conn.close()
        return jsonify({"status":"success","message":"Feedback submitted successfully."}),200
    except Exception as e:
        return jsonify({"error":str(e)}),500
    


#Fetch emp performance for individual employees.    
@feedbackandperformance.route('/myPeformancesAndFeedbacks', methods=['GET'])
def myPeformancesandFeedbacks():
    try:
        if 'employeeId' not in session or session.get('permission') not in [2,3]:
            return jsonify({"message":"Un-authorized access"}),401

        employeeID = session.get("employeeId")
        
        conn,cursor = FP_Handler._conn_globalInfo()
        cursor.execute("""select id,empId,name,rating,comment,givenBy,
                createdAt from Feedback where empId = ? ORDER BY createdAt DESC;""",(employeeID,))
        
        massData = cursor.fetchall()

        if not massData:
            return jsonify([]), 200
        
        result = []
        for field in massData:
            result.append({
                "feedbackId": field[0],
                "empId": field[1],
                "name": field[2],
                "rating": field[3],
                "comment": field[4],
                "givenBy": field[5],
                "createdAt": field[6]
            })
        conn.close()
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({"status":"error"})
    finally:
        if conn:
            conn.close()

#This is to fetch performance
@feedbackandperformance.route('/feedback/all', methods=['GET'])
def fetchAllFeedback():
    if 'employeeId' not in session or session.get('permission') != 1:
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401

    try:
        conn, cursor = FP_Handler._conn_globalInfo()
        cursor.execute("""
            SELECT id, empId, name, rating, comment, givenBy, createdAt
            FROM Feedback
            ORDER BY createdAt DESC
        """)
        rows = cursor.fetchall()
        conn.close()

        return jsonify([
            {
                "feedbackId": r[0],
                "empId": r[1],
                "name": r[2],
                "rating": r[3],
                "comment": r[4],
                "givenBy": r[5],
                "createdAt": r[6]
            } for r in rows
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#This is to delete feedback
@feedbackandperformance.route('/feedback/<int:feedbackId>', methods=['DELETE'])
def deleteFeedback(feedbackId):
    
    if not session or session.get("permission") != 1:
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401

    conn = None
    conn2 = None
    try:
        conn, cursor = FP_Handler._conn_globalInfo()

        # Get empId before deleting
        cursor.execute("SELECT empId FROM Feedback WHERE id = ?", (feedbackId,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return jsonify({"message": "Feedback not found.", "status": "error"}), 404

        empID = row[0]  # extract string from tuple

        # Delete feedback
        cursor.execute("DELETE FROM Feedback WHERE id = ?", (feedbackId,))
        conn.commit()
        conn.close()
        conn = None

        # Get role of employee whose feedback was deleted
        conn2, cursor2 = FP_Handler._conn_comp()
        cursor2.execute("""SELECT login.role FROM login
                        LEFT JOIN emp.'user' AS emp ON login.id = emp.auth_id
                        WHERE emp.employeeId = ?""", (empID,))
        roleRow = cursor2.fetchone()
        fetchedRole = roleRow[0] if roleRow else ""
        conn2.close()
        conn2 = None

        # Notify employee and admins
        notifManager.insert_notification(
            employeeId=empID, role=fetchedRole,
            message="Your feedback has been deleted.")
        notifManager.insert_notification(
            message=f"A feedback given to {empID} has been deleted.",
            adminOnly=True)

        return jsonify({"message": "Feedback removed.", "status": "success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
        if conn2:
            conn2.close()