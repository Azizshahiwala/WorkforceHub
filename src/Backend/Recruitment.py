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
from dotenv import load_dotenv
#For pdf viewing, we need
import io,os
from flask import send_file

#For unique user profile id. NOT auth_id
from datetime import datetime, date, time, timezone
recruit = Blueprint('Recruitment', __name__, url_prefix='/api')

class Recruitment:
    def __init__(self, compPath, credPath, recPath):
        load_dotenv("../../.env")
        self.recPath = recPath
        self.credPath = credPath
        self.compPath = compPath
        self._compURL = os.getenv("VITE_WEB_PATH")
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
        notifManager.insert_notification(message=f"A new user: {name} has been admitted, will give interview shortly.. ",isGlobal=True)
        
        #Now send email to the person.
        conn,cursor = manager._get_connection()
        cursor.execute("select name,email,role from TempStatusTable where Temp_id = ?",(id,))
        acceptdata = cursor.fetchone()
        conn.close()
        subject = f"Offer of Employment: {acceptdata[2]} at MSP Concept"
        emailbody=f"""Dear {acceptdata[0]},

Congratulations! We are thrilled to officially offer you the position of {acceptdata[2]} with the MSP Concept team.\n\n
Your performance during our interview process was exceptional, and we were particularly impressed by your insights and alignment with our company values. We believe your skills will be a significant asset to our department.\n
Account Activation & Next Steps: To begin your onboarding, we have created your official employee profile. You can now log in to our internal portal to complete your documentation:\n
Portal URL: {manager._compURL}\n
Username: {acceptdata[1]}\n
Temporary Password: placeholder\n\n
Please change your password immediately upon your first login for security purposes.\n
We are excited to have you join us and look forward to your contributions. If you have any questions regarding the onboarding process, please feel free to reach out to the HR department.\n
Welcome to the team!\n
Best regards,\n\n
The HR Team MSP Concept"""
        
        #Remove tempstatusdata
        manager.cleanupTempTable(Tempid)

        #Send email 
        emailService.send_email(emailService.username,acceptdata[1],subject,emailbody)
        return jsonify({"message": "Employee successfully admitted", "status": "success"}), 200
    except Exception as e:
        if 'conn' in locals(): conn.close()
        return jsonify({"message": f"Error during admission process: {e}", "status": "error"}), 500
    finally:
        if conn:
            conn.close() # This runs even if the code crashes

@recruit.route("/recruit/reject/<int:id>", methods=["DELETE"])
def reject_candidate(id):

    conn,cursor = manager._get_connection()
    cursor.execute("select name,email,role from TempStatusTable where Temp_id = ?",(id,))
    rejdata = cursor.fetchone()
    conn.close()
    emailbody = f"""
Dear {rejdata[0]},\n
Thank you for giving us the opportunity to review your application and for participating in our recent interview process. We truly appreciate the time and effort you put into your candidacy for the {rejdata[2]} role.\n
After careful consideration of your background, experience, and our current business needs, we have decided to move forward with other candidates at this time.\n
Please note that this decision is specific to this particular role and does not reflect your overall potential. We were impressed with your [Specific Skill/Strength found by AI], and we encourage you to keep an eye on our careers page for future openings that may be a better match for your skillset.\n
We wish you the very best in your job search and your future professional endeavors.\n\n
Best regards,\n\n
The HR Team MSP Concept"""
    emailService.send_email(emailService.username,{rejdata[1]},f"Update regarding your application for {rejdata[2]} at MSP Concept",emailbody)
    manager.cleanupTempTable(id)
    return jsonify({"message": "Candidate rejected"}), 200  

@recruit.route('/recruit/resume/<int:id>', methods=['GET'])
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

@recruit.route('/recruit/getanalysis/<string:id>', methods=['POST'])
@limiter.limit("2 per minute")
def get_ai_analysis(id,interview_transcript=None):
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
            final_score = ai_sorter_manager.find_score(interview_transcript,cleaned_data)
            final_description = ai_sorter_manager.find_description(interview_transcript,cleaned_data,final_score)
            
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
        
        emailService.sendInterviewLink(to_email=email,candidate_name=name,Tempid=Tempid)

        return jsonify({"message": "Interview link sent successfully", "status": "success"}), 200
    except Exception as e:
        return jsonify({"message": f"Error sending interview link: {e}", "status": "error"}), 500
    

@recruit.route('/recruit/process-test', methods=['POST','GET'])
def processTestResults():
    try:
        data = rq.get_json()
        candidate_id = data.get('id')
        interview_transcript = data.get('answers') # From InterviewStart.jsx

        # 1. Update the record with the transcript first
        # We temporarily store this in AI_DESCRIPTION or a new 'transcript' column
        conn, cursor = manager._get_connection()
        
        #update the status so HR knows the interview is done
        cursor.execute("""
            UPDATE TempStatusTable 
            SET AI_DESCRIPTION = ?, status = 'Interviewed' 
            WHERE id = ?
        """, (interview_transcript, candidate_id))
        conn.commit()
        conn.close()
        
        #recalculate the score based on the new data
        result = get_ai_analysis(candidate_id,interview_transcript)
        print("Analysis complete: ", result[0].get_json())
        
        return result

    except Exception as e:
        return jsonify({"error": str(e)}), 500