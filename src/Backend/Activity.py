from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
from datetime import datetime
from Notification import notifManager
from PathConfig import CompanyUserPath,CredentialsPath,GlobalInfoPath
activity = Blueprint('activity', __name__, url_prefix='/api')

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
        givenById TEXT NOT NULL,
        givenByRole TEXT NOT NULL,
        dateCreated TEXT NOT NULL
        );
        ''')
        conn.commit()
        conn.close()
    def insertAnnouncement(self,message,givenById,givenByRole,dateCreated):
        conn,cursor = self._conn_globalInfo()

        insertQuery = """insert into Activity(activity,givenById,givenByRole,dateCreated) values(?,?,?,?);"""
        cursor.execute(insertQuery,(message,givenById,givenByRole,dateCreated,))
        conn.commit()
        conn.close()
        
        return None
    
activityManager = Activity(CompanyUserPath,CredentialsPath,GlobalInfoPath)

def createActivity():
    activityManager.createActivityTables()
    
@activity.route("/fetchAnnouncements",methods=["GET"])
def fetchAnnouncements():
    conn, cursor = activityManager._conn_globalInfo()
    cursor.execute("""
        SELECT activity, givenById, givenByRole, dateCreated
        FROM Activity
        ORDER BY id DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "message": r[0],
            "givenById": r[1],
            "givenByRole": r[2],
            "dateCreated": r[3]
        } for r in rows
    ])

@activity.route("/insertAnnouncement/<string:givenById>",methods=["POST"])
def insertAccouncement(givenById):

    if givenById == None:
        return jsonify([])
    
    dataReq = rq.get_json()
    message = dataReq

    conn,curosr = activityManager._conn_globalInfo()
    
    CurrentTimeStamp = datetime.now().strftime("%y-%m-%d %I:%M:%S %p")
    CurrentRoleQuery = """select department from comp_db.user where employeeId = ?;"""
    
    curosr.execute(CurrentRoleQuery,(givenById,))

    fetchedData = curosr.fetchone()

    if not fetchedData:
        return jsonify({"error": "Invalid user"}), 400

    givenByRole = fetchedData[0]
    
    conn.close()
    activityManager.insertAnnouncement(message,givenById,givenByRole,CurrentTimeStamp)
    
    #Notification area - global message
    notifManager.insert_notification(message=f"An announcement has been posted by {givenByRole}.",isGlobal=True)
        
    return jsonify({
    "dateCreated": CurrentTimeStamp,
    "message": message,
    "givenById": givenById,
    "givenByRole": givenByRole
}), 200  
    


