#This file handles notification processing.

from flask import request as rq
from flask import Blueprint, jsonify
import os
import sqlite3 as sq
from datetime import datetime, date, time, timezone
from PathConfig import CompanyUserPath,CredentialsPath
notification = Blueprint('notification',__name__,url_prefix='/api')

class Notification:
    def __init__(self, compPath, credPath):
        self.credPath = credPath
        self.compPath = compPath

    def _conn_login(self):
        conn = sq.connect(self.credPath)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        return conn, cursor
    
    def _conn_user(self):
        conn = sq.connect(self.compPath)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        return conn, cursor
    
    def createNotifsTable(self):
        try:
            conn,cursor = self._conn_user()
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS Notification(
                NotifsId INTEGER PRIMARY KEY AUTOINCREMENT,
                employeeId TEXT NOT NULL,
                role TEXT NOT NULL,
                NotifDateReceived TEXT NOT NULL,
                Message TEXT NOT NULL,
                Status TEXT DEFAULT 'Unread' NOT NULL,
                isGlobal BOOLEAN DEFAULT 0 NOT NULL,
                adminOnly BOOLEAN DEFAULT 0 NOT NULL
            );
            ''')
            conn.commit()
            conn.close()
            #print("✅ Database Notifs ready")
            return True
        except Exception as e:
            print(f"❌ DB Error: {e}")
            return False 
        finally:
            if conn:
                conn.close() # This runs even if the code crashes
    def insert_notification(self,employeeId="", role="", message="", isGlobal=False, adminOnly=False):
        try:
            conn ,cursor = self._conn_user()
            
            #Global notif
            if isGlobal and not adminOnly:
                adminOnly = 0
                isGlobal = 1
                employeeId = "All"
                role = "All"
            #Admin only notif
            elif adminOnly and not isGlobal:
                adminOnly = 1
                isGlobal = 0
                employeeId= "Special"
                role = "Special"
            #Specific notif
            else:
                adminOnly = 0
                isGlobal = 0

            date_now = datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")
            cursor.execute("""
                INSERT INTO Notification (employeeId, role, NotifDateReceived, Message, isGlobal, adminOnly)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (employeeId, role, date_now, message, isGlobal,adminOnly))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"Error inserting notification: {e}")
            return False
        finally:
            if conn:
                conn.close() 
    

notifManager = Notification(CompanyUserPath,CredentialsPath)    
def createNotifs():
    notifManager.createNotifsTable()

@notification.route('/getNotifs/<string:employeeId>/<string:role>', methods=['GET'])
def get_notifications(employeeId,role):
    try:
        conn ,cursor = notifManager._conn_user()
        cursor.execute("""SELECT * FROM Notification WHERE employeeId = ? 
                       OR isGlobal = 1 
                       OR employeeId = 'All'
                       OR (employeeId = 'Special' AND ? IN ('Admin','CEO')) 
                       ORDER BY NotifsId DESC""", (employeeId,role,))
        rows = cursor.fetchall()
        conn.close()
        
        result = [{
            "NotifsId": r[0],
            "employeeId": r[1],
            "role": r[2],
            "date": r[3],
            "message": r[4],
            "status": r[5],
            "isGlobal":bool(r[6]),
            "adminOnly":bool(r[7])
        } for r in rows]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes
    
@notification.route('/markRead/<int:notifId>', methods=['POST'])
def mark_as_read(notifId):
    try:
        conn,cursor = notifManager._conn_user()
        cursor.execute("UPDATE Notification SET Status = 'Read' WHERE NotifsId = ?", (notifId,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes