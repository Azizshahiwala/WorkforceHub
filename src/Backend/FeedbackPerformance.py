from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
from datetime import datetime, date, time, timezone
import traceback
#Feedback and performance are different.
#Ref: FeedbackEmployee.jsx, AdminFeedback.jsx, EmployeePerformance.jsx, FeedbackEmployee.jsx, Performance.jsx
feedbackandperformance = Blueprint('feedbackPerformance', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
PerformancePath = os.path.join(databaseDir, "FeedbackPerformance.db")

class FeedbackPerformance:
    def __init__(self, compUser_path, cred_path, perf_path):
        self.compUser_path = compUser_path
        self.cred_path = cred_path
        self.perf_path = perf_path

    def _conn_perf(self):
        conn = sq.connect(self.perf_path)
        cursor = conn.cursor()

        conn.execute("PRAGMA foreign_keys = ON;")
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        
        return conn, cursor

    def createfeedbackPerformance(self):
        conn,cursor = self._conn_perf()
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
        
FP_Handler = FeedbackPerformance(CompanyUserPath,CredentialsPath,PerformancePath)

def FeedbackPerformanceSetup():
    FP_Handler.createfeedbackPerformance()

@feedbackandperformance.route("/submitFeedback/<string:employeeId>",methods=['POST'])
def submitFeedBack(employeeId):
    data = rq.get_json()
    
    name = data.get("name")
    rating = data.get("rating")
    comment = data.get("comment")
    givenBy = data.get("givenBy")
    createdAt = datetime.now()
    print(name,rating,comment,givenBy,createdAt,givenBy)
    conn,cursor = FP_Handler._conn_perf()

    cursor.execute("""
    insert into Feedback(empId, name, rating, comment, givenBy, createdAt) values(?,?,?,?,?,?);
                   """,(employeeId,name,rating,comment,givenBy,createdAt,))
    
    conn.commit()
    conn.close()
    print(f"Feedback given to {employeeId}.")
    return jsonify({"status":"success"}),200

@feedbackandperformance.route('/fetchReviewers', methods=['GET'])
def fetch_reviewers():
    try:
        conn = sq.connect(CompanyUserPath)
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{CredentialsPath}' AS cred_db")

        cursor.execute("""
            SELECT u.employeeId, u.name, l.role
            FROM "user" u
            JOIN cred_db.login l ON u.auth_id = l.id
            WHERE l.role IN ('Admin', 'CEO')
        """)

        rows = cursor.fetchall()
        conn.close()

        return jsonify([
            {
                "employeeId": r[0],
                "name": r[1],
                "role": r[2]
            } for r in rows
        ]), 200

    except Exception as e:
        print("fetchReviewers ERROR:", e)
        return jsonify({"error": str(e)}), 500
    
#Fetch emp performance for individual employees.    
@feedbackandperformance.route('/myPeformancesAndFeedbacks/<string:employeeID>', methods=['GET'])
def myPeformancesandFeedbacks(employeeID):
    try:
        conn,cursor = FP_Handler._conn_perf()
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
        traceback.print_exc()
        print(e)
        return jsonify({"status":"error"})
        