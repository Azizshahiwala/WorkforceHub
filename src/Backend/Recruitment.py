#This file is entry point for resume uploading.
#This step creates separate react file for resume uploading feature.
#Then it is sent to Recruitement.jsx
#when approved, it is stored in db. Once approved, registered user cannot access this portal.
#If rejected, entry is deleted and guest can try to upload again.

from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq

recruitment = Blueprint('Recruitment', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
#This is where our resume will be stored.
#This will be, Document Repository
RecruitmentPath = os.path.join(databaseDir, "Recruitment.db")

class Recruitment:
    def __init__(self, compPath, credPath, recPath):
        self.recPath = recPath
        self.credPath = credPath
        self.compPath = compPath

    def _get_connection(self):
        conn = sq.connect(self.recPath)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        return conn, cursor
    
    #This creates a table for in-coming requests.
    def create_table_TempStatusTable(self):
        conn, cursor = self._get_connection()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS TempStatusTable(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                resume BLOB NOT NULL,
                status TEXT DEFAULT 'Pending'
            );
        """)
        conn.commit()
        conn.close()

    #This creates a table for Accepted candidates.
    def create_table_MainStatusTable(self):
        conn, cursor = self._get_connection()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS MainStatusTable(
                auth_id INTEGER UNIQUE,
                email TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                resume BLOB NOT NULL
            );
        """)
        conn.commit()
        conn.close()
manager = Recruitment(CompanyUserPath, CredentialsPath, RecruitmentPath)

def createRecruitment():
    manager.create_table_TempStatusTable()
    manager.create_table_MainStatusTable()