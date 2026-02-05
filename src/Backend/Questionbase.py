from flask import Blueprint, jsonify, request
from groq import Groq
import json,os
from dotenv import load_dotenv
from Core.AISorter import ai_sorter_manager
from PathConfig import RecruitmentPath
import sqlite3 as sq

quebase = Blueprint('questionBank', __name__, url_prefix='/api')
client = None 
class questionbase:
    def __init__(self,rec_path):
        load_dotenv("../../.env")
        self._recpath = rec_path
        global client 
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def recr_conn(self):
        try:
            # Connect to the recruitment database
            conn = sq.connect(self._recpath)
            cursor = conn.cursor()
            
            return conn,cursor
        except Exception as e:
            print(f"Error fetching role: {e}")
            return "General"
    def fetch_role(self,candidateID):
        applyingFor = ""
        conn,cursor = self.recr_conn()
        
        cursor.execute("SELECT role FROM TempStatusTable WHERE id = ?", (candidateID,))
        applyingFor = cursor.fetchone()
        conn.close()   
        return applyingFor[0] if applyingFor else "General"
    # Function to interact with AI and get structured data
    @staticmethod
    def generate_questions(resume_text,candidateId=None,role=None):

        if candidateId == None and role == None:
            return jsonify({{"profession": None,"skills": None,"questions": None,"role_mismatch": True}})
        
        prompt = f"""
        Generate TECHNICAL interview questions based on a resume.
        I HAVE PASSED THE FOLLOWING:
        Role applying for: {role} , candidate id : {candidateId}

        IMPORTANT:
        - DO NOT include greeting or introduction questions.
        - DO NOT ask "tell me about yourself".
        - Generate ONLY technical or project-based questions.
        - Use ONLY skills, tools, or projects mentioned in the resume.
        - Avoid generic questions.
        - RETURN ONLY VALID JSON.
        - DO NOT add explanations.
        - DO NOT add markdown.
        - DO NOT add extra text.

        JSON format:
        {{
        "profession": "",
        "skills": [],
        "questions": [],
        "role_mismatch": False
        }}

        Rules:
        - profession: inferred from resume
        - skills: max 5, from resume only
        - questions: exactly 4 technical interview questions
        - If 'role from resume' and passed(this) role differ, change role_mismatch to True, else False.
        
        Resume:
        {resume_text}
        """
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        return response.choices[0].message.content.strip()

queHandler = questionbase(RecruitmentPath)
#API endpoint to handle resume upload for reference
@quebase.route("/interview-process", methods=["POST"])
def start_parsing():
    candidateId = request.form.get("candidateId")
    print("FILES RECEIVED:", request.files)
    # 1. Check file exists
    if "resume" not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    file = request.files["resume"]

    #1. convert to binary data
    binary_data = file.read()

    #2. parse text
    resume_text = ai_sorter_manager.convert_data_to_str(binary_data)

    #2.1. check
    if not resume_text or not resume_text.strip():
        return jsonify({"error": "Resume text empty"}), 400

    applyingFor = queHandler.fetch_role(candidateId)
    print("Applying for: ",applyingFor)
   
    # 4. Call AI (limit size for safety)
    ai_raw = queHandler.generate_questions(resume_text[:6000],candidateId,applyingFor)

    print("===== AI RAW OUTPUT =====")
    print(ai_raw)
    print("=========================")

    # 5. Parse json from AI
    try:
        ai_data = json.loads(ai_raw)
    except Exception:
        ai_data = {
            "profession": "",
            "skills": [],
            "questions": [],
            "role_mismatch":True
        }

    # 6. Always return JSON
    return jsonify(ai_data), 200