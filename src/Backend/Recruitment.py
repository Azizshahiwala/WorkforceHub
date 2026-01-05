#This file is entry point for resume uploading.
#This step creates separate react file for resume uploading feature.
#Then it is sent to Recruitement.jsx
#when approved, it is stored in db. Once approved, registered user cannot access this portal.
#If rejected, entry is deleted and guest can try to upload again.

from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq

#For pdf viewing, we need
import io
from flask import send_file

#For unique user profile id. NOT auth_id
from datetime import datetime, date, time, timezone
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
                role TEXT NOT NULL,
                gender TEXT NOT NULL,
                name TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                resume BLOB NOT NULL,
                PersonExperience TEXT NOT NULL,
                applied_date TEXT,
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
                role TEXT NOT NULL,
                gender TEXT NOT NULL,
                name TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                resume BLOB NOT NULL,
                PersonExperience TEXT NOT NULL
            );
        """)
        conn.commit()
        conn.close()
    def cleanupTempTable(self,idToDelete):
        conn,cursor = self._get_connection()
        cursor.execute("delete from TempStatusTable where id = ?",(idToDelete,))   
        conn.commit()
        conn.close()
manager = Recruitment(CompanyUserPath, CredentialsPath, RecruitmentPath)

def createRecruitment():
    manager.create_table_TempStatusTable()
    manager.create_table_MainStatusTable()

@recruitment.route('/RegisterForm/applications', methods=['GET'])
def fetchApplications():
    try:
        conn, cursor = manager._get_connection()

        TempItems = "SELECT id, email, role, gender, name, phoneNumber, PersonExperience, status, applied_date FROM TempStatusTable"
        cursor.execute(TempItems)
        Candidates = cursor.fetchall()

        conn.close()

        result = [{
            "id": r[0],
            "email": r[1],
            "position": r[2],          
            "gender": r[3],
            "name": r[4],
            "phone": r[5],
            "experience": r[6],        
            "status": r[7],
            "appliedDate": r[8]  # This is the new applied_date column
        } for r in Candidates]

        return jsonify(result), 200
    except Exception as e:
        print("Error from fetchApplications:",e)
        return jsonify({"error": str(e), "status": "error"}), 500

@recruitment.route('/RegisterForm/applications/upload', methods=['POST'])
def resumeProcess():
    #We use rq.form and rq.file because we used formData
    email = rq.form.get('email')
    phoneNumber = rq.form.get('phoneNumber')
    role = rq.form.get('selectedRole')
    personExp = rq.form.get('personExperience')
    gender = rq.form.get('gender')
    name = rq.form.get('name')
    resume = rq.files.get('file')  # base64 encoded string
    status = 'Pending'
    applied_date = datetime.now().strftime("%d %b, %Y") # Format: 05 Jan, 2026
    
    #To store resume, we convert it to binary data.
    binary_resume = resume.read()
    try:
        conn, cursor = manager._get_connection()
        cursor.execute("""
            INSERT INTO TempStatusTable (email, role, gender, name, phoneNumber, resume, PersonExperience, status, applied_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (email, role, gender, name, phoneNumber, binary_resume, personExp, status, applied_date))
        conn.commit()
        conn.close()
        return jsonify({"message": "Application uploaded. Please wait for approval.", "status": "success"}), 200
    except Exception as e:
        return jsonify({"message": f"Error uploading resume: {e}", "status": "error"}), 500
    
@recruitment.route('/RegisterConfirm/<int:Tempid>', methods=['POST'])
def admitEmployee(Tempid):
    conn,cursor = manager._get_connection()
    TempItems = "select * from TempStatusTable where id = ?;"
    cursor.execute(TempItems,(Tempid,))
    Candidate = cursor.fetchone()

    if not Candidate:
            return jsonify({"message": "Candidate not found", "status": "error"}), 404
    
    email = Candidate[1]
    role = Candidate[2]
    gender = Candidate[3]
    name = Candidate[4]
    phoneNumber = Candidate[5]

    conn.close()
    
    try:
        #Now paste into LoginTable.
        conn,cursor = manager._conn_login()

        #Lets generate a entry
        loginEntry = "insert into login(email,password,role,gender,phoneNumber) values(?,?,?,?,?);"
        cursor.execute(loginEntry,(email,"placeholder123",role,gender,phoneNumber))
    
        # This is your autogenerated System ID
        new_auth_id = cursor.lastrowid
        conn.commit()
        conn.close()

        #Now set users.
        conn,cursor = manager._conn_user()

        #Lets create a profile
        userEntry = "insert into user(auth_id,name,employeeId,department,status,lastLogin,BaseSalary) values(?,?,?,?,?,?,?);"
        employeeId = 'P'+datetime.now().strftime("%y%m%d%H%M%S")
        cursor.execute(userEntry,(new_auth_id,name,employeeId,role,'Just admitted',datetime.now().strftime("%S%M%H %d%m%y"),0.0))
        conn.commit()

        manager.cleanupTempTable(Tempid)

        return jsonify({"message": "Employee successfully admitted", "status": "success"}), 200
    except Exception as e:
        if 'conn' in locals(): conn.close()
        return jsonify({"message": f"Error during admission process: {e}", "status": "error"}), 500

@recruitment.route("/recruitment/reject/<int:id>", methods=["DELETE"])
def reject_candidate(id):
    manager.cleanupTempTable(id)
    return jsonify({"message": "Candidate rejected"}), 200  

@recruitment.route('/recruitment/resume/<int:id>', methods=['GET'])
def get_resume(id):
    try:
        conn, cursor = manager._get_connection()
        # Fetch only the resume BLOB for the specific ID
        cursor.execute("SELECT resume FROM TempStatusTable WHERE id = ?", (id,))
        record = cursor.fetchone()
        conn.close()

        if record and record[0]:
            # Convert binary data to a file-like object and send as PDF
            return send_file(
                io.BytesIO(record[0]),
                mimetype='application/pdf',
                as_attachment=False,
                download_name=f"resume_{id}.pdf"
            )
        else:
            return jsonify({"message": "Resume not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500    
