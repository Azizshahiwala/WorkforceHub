from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
from datetime import datetime, date, time, timezone

activity = Blueprint('activity', __name__, url_prefix='/api')
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
GlobalInfoPath = os.path.join(databaseDir, "GlobalInfo.db")

class Activity:
    def __init__(self, compUser_path, cred_path, globalInfo_path):
        self.compUser_path = compUser_path
        self.cred_path = cred_path
        self.globalInfo_path = globalInfo_path

    def _conn_globalInfo(self):
        conn = sq.connect(self.globalInfo_path)
        cursor = conn.cursor()

        conn.execute("PRAGMA foreign_keys = ON;")
        cursor.execute(f"ATTACH DATABASE '{self.compUser_path}' AS comp_db")
        
        return conn, cursor
    
    def createActivityTables(self):
        conn,cursor = self._conn_globalInfo()
       
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Activity(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity TEXT NOT NULL,
        givenBy TEXT NOT NULL,
        dateCreated TEXT NOT NULL
        );
        ''')
        conn.commit()
        conn.close()
    
activityManager = Activity(CompanyUserPath,CredentialsPath,GlobalInfoPath)

def createActivity():
    activityManager.createActivityTables()
    
@activity.route()
def fetchAnnouncements():
    pass 

@activity.route()
def insertAccouncement():
    pass


