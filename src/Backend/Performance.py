from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
from datetime import datetime, date, time, timezone

#Feedback and performance fall into same category.
#Ref: FeedbackEmployee.jsx, AdminFeedback.jsx, EmployeePerformance.jsx, FeedbackEmployee.jsx, Performance.jsx
performance = Blueprint('performance', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
PerformancePath = os.path.join(databaseDir, "Performance.db")

class Performance:
    def __init__(self, compUser_path, cred_path, perf_path):
        self.compUser_path = compUser_path
        self.cred_path = cred_path
        self.perf_path = perf_path

    def _conn_perf(self):
        conn = sq.connect(self.perf_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        return conn, cursor

    def createPerformanceDB(self):
        conn,cursor = self._conn_perf()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Performance(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                empId TEXT NOT NULL,
                name TEXT NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                date TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()
        
performanceHandler = Performance(CompanyUserPath,CredentialsPath,PerformancePath)

def createPerformanceSetup():
    performanceHandler.createPerformanceDB()

