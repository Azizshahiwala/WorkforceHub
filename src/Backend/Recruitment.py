#This file is entry point for resume uploading.
#This step creates separate react file for resume uploading feature.
#Then it is sent to Recruitement.jsx
#when approved, it is stored in db. Once approved, registered user cannot access this portal.
#If rejected, entry is deleted and guest can try to upload again.

from flask import request as rq
from flask import Blueprint,jsonify
from Core.AISorter import ai_sorter_manager
from Core.Limiter import limiter
from Core.EmailService import emailService
import sqlite3 as sq
from PathConfig import CompanyUserPath,CredentialsPath,RecruitmentPath
from Notification import notifManager

#For pdf viewing, we need
import io
from flask import send_file

#For unique user profile id. NOT auth_id
from datetime import datetime, date, time, timezone
recruit = Blueprint('Recruitment', __name__, url_prefix='/api')

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
                status TEXT DEFAULT 'Pending',
                AI_SCORE TEXT DEFAULT 'Not calculated',
                AI_DESCRIPTION TEXT DEFAULT 'Not generated'
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
                PersonExperience TEXT NOT NULL,
                AI_SCORE TEXT null,
                AI_DESCRIPTION TEXT null
            );
        """)
        conn.commit()
        conn.close()

    def cleanupTempTable(self,idToDelete):
        conn,cursor = self._get_connection()
        cursor.execute("delete from TempStatusTable where id = ?",(idToDelete,))   
        conn.commit()
        conn.close()

    def createBackup(self,new_auth_id,email,role,gender,name,phoneNumber,binary_resume,PersonExperience,AI_SCORE="Not calculated",AI_DESCRIPTION="Not generated"):
        conn,cursor = self._get_connection()
        
        cursor.execute("insert into MainStatusTable values(?,?,?,?,?,?,?,?,?,?)",(new_auth_id,email,role,gender,name,phoneNumber,binary_resume,PersonExperience,AI_SCORE,AI_DESCRIPTION)) 
        conn.commit()
        conn.close()
manager = Recruitment(CompanyUserPath, CredentialsPath, RecruitmentPath)

def createRecruitment():
    manager.create_table_TempStatusTable()
    manager.create_table_MainStatusTable()

@recruit.route('/RegisterForm/applications', methods=['GET'])
def fetchApplications():
    try: 
        conn, cursor = manager._get_connection()

        TempItems = "SELECT id, email, role, gender, name, phoneNumber, PersonExperience, status, applied_date, AI_SCORE, AI_DESCRIPTION FROM TempStatusTable"
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
            "appliedDate": r[8],  # This is the new applied_date column
            "AI_SCORE": r[9],  # This is the new AI_Review column
            "AI_DESCRIPTION": r[10]  # This is the new AI_Description column
        
        } for r in Candidates]

        return jsonify(result), 200
    except Exception as e:
        print("Error from fetchApplications:",e)
        return jsonify({"error": str(e), "status": "error"}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes
            
@recruit.route('/RegisterForm/applications/upload', methods=['POST'])
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
    applied_date = datetime.now().strftime("%y-%m-%d %I:%M:%S %p") # Format: 05 Jan, 2026
    
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
    finally:
        if conn:
            conn.close() # This runs even if the code crashes

@recruit.route('/RegisterConfirm/<int:Tempid>', methods=['POST'])
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
    BinaryRes = Candidate[6]
    PersonExp = Candidate[7]

    AI_score = Candidate[-2]
    AI_description = Candidate[-1]
    

    conn.close()
    
    try:
        #Now paste into LoginTable.
        conn,cursor = manager._conn_login()

        #Lets generate a entry
        loginEntry = "insert into login(email,password,role,gender,phoneNumber) values(?,?,?,?,?);"
        cursor.execute(loginEntry,(email,"placeholder",role,gender,phoneNumber))
    
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

        #Save
        manager.createBackup(new_auth_id,email,role,gender,name,phoneNumber,BinaryRes,PersonExp,AI_score,AI_description)
        manager.cleanupTempTable(Tempid)
        notifManager.insert_notification(message=f"A new user: {name} has been admitted, will give interview shortly.. ",isGlobal=True)
        return jsonify({"message": "Employee successfully admitted", "status": "success"}), 200
    except Exception as e:
        if 'conn' in locals(): conn.close()
        return jsonify({"message": f"Error during admission process: {e}", "status": "error"}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes

@recruit.route("/recruitment/reject/<int:id>", methods=["DELETE"])
def reject_candidate(id):
    manager.cleanupTempTable(id)
    return jsonify({"message": "Candidate rejected"}), 200  

@recruit.route('/recruitment/resume/<int:id>', methods=['GET'])
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
    finally:
        if conn:
            conn.close()    

@recruit.route('/recruitment/getanalysis/<string:id>', methods=['POST'])
@limiter.limit("2 per minute")
def get_ai_analysis(id):
    try:
        conn, cursor = manager._get_connection()
        # Fetch only the resume BLOB for the specific ID
        cursor.execute("SELECT resume FROM TempStatusTable WHERE id = ?", (id,))
        record = cursor.fetchone()

        if record and record[0]:
            binary_resume = record[0]
            
            # Here, you would integrate with AISorter to get the score
            rawdata = ai_sorter_manager.convert_data_to_str(binary_resume)
            cleaned_data = ai_sorter_manager.clean_text(rawdata)
            final_score = ai_sorter_manager.find_score(cleaned_data)
            final_description = ai_sorter_manager.find_description(cleaned_data,final_score)
            
            print("Final AI Score: ",final_score)
            # Update the score and description in the database
            cursor.execute("UPDATE TempStatusTable SET AI_SCORE = ?, AI_DESCRIPTION = ? WHERE id = ?", (final_score,final_description,id))
            conn.commit()
            conn.close()

            return jsonify({"status": "success", "message": "AI score calculated", "AI_SCORE": final_score, "AI_DESCRIPTION": final_description}), 200
        else:
            return jsonify({"message": "Resume not found"}), 404
    except Exception as e:
        if 'conn' in locals(): conn.close()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@recruit.route('/recruit/send-invite/<int:Tempid>', methods=['POST'])
def send_interview_link(Tempid):
    data = rq.get_json()
    email = data.get('email')
    name = data.get('name')
    try:
        
        emailService.sendInterviewLink(email,name,Tempid)

        return jsonify({"message": "Interview link sent successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"message": f"Error sending interview link: {e}", "status": "error"}), 500