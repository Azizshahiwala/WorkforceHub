# src/Database/Users.py
import sqlite3 as sq 
from PathConfig import CompanyUserPath,CredentialsPath
from flask import Blueprint, jsonify,session,request as rq
from Notification import notifManager
from Core.EmailService import emailService

users = Blueprint('CentralUserBase', __name__, url_prefix='/api')

LEVELS = {
    "Intern":         (1, 3),
    "Tester":         (1, 3),
    "Support":        (1, 3),
    "Sales Manager":  (2, 2),
    "Designer":       (2, 2),
    "Developer":      (2, 2),
    "Marketing":      (2, 2),
    "Finance":        (2, 2),
    "HR":             (3, 1),
    "Admin":          (4, 1),
    "CEO":            (4, 1),}
 
ROLE_HIERARCHY = [
    "Intern", "Tester", "Support",
    "Sales Manager", "Designer", "Developer", "Marketing", "Finance",
    "HR",
    "Admin", "CEO",
]
 
ROLES = list(LEVELS.keys())

class UserDB:
    def __init__(self, db_path, cred_path):
        self.db_path = db_path
        self.cred_path = cred_path

    def _get_connection(self):
        conn = sq.connect(self.db_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.cred_path}' AS cred_db")
        return conn, cursor
    
    def _get_cred_connection(self):
        conn = sq.connect(self.cred_path)
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.db_path}' AS emp")
        return conn, cursor

    def create_table(self):
        conn, cursor = self._get_connection()
        query = """
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            auth_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            employeeId TEXT UNIQUE NOT NULL,
            department TEXT,
            status TEXT DEFAULT 'Logged Out',
            lastLogin TEXT,
            BaseSalary REAL DEFAULT 0.0
        );
        """
        cursor.execute(query)
        conn.commit()
        conn.close()

    def fetch_all_with_credentials(self):
        conn, cursor = self._get_connection()
        
        query = """
   SELECT emp.name, emp.employeeId, emp.department, emp.status, emp.lastLogin, 
   login.role, login.gender, login.email, login.phoneNumber, emp.BaseSalary, emp.auth_id
   FROM "user" AS emp 
   LEFT JOIN cred_db.login AS login ON emp.auth_id = login.id
    """
        cursor.execute(query)
        data = cursor.fetchall()
        conn.close()
        return data

# Instantiate the object
user_manager = UserDB(CompanyUserPath, CredentialsPath)

def createCompanyUsers():
    user_manager.create_table()

@users.route("/getCompanyUsers", methods=['GET'])
def get_company_users():
    try:
        data = user_manager.fetch_all_with_credentials()
        result = [
            {
                "name": r[0], "employeeId": r[1], "department": r[2], 
                "status": r[3], "lastLogin": r[4], "role": r[5], 
                "gender": r[6], "email":r[7], "phoneNumber": r[8],"BaseSalary": r[9],
                "auth_id":r[10]
            } for r in data
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users.route("/promote/<string:auth_id>", methods=['POST'])
def promote(auth_id):
    if 'employeeId' not in session or session.get('permission') != 1:
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401
 
    try:
        data = rq.get_json()
        amount = float(data.get("amount", 0))
        new_department = data.get("department", None)
 
        if amount <= 0:
            return jsonify({"message": "Amount must be greater than 0.", "status": "error"}), 400
 
        conn, cursor = user_manager._get_cred_connection()

        cursor.execute("""
            SELECT login.role, emp."user".BaseSalary, emp."user".employeeId, emp."user".name
            FROM login
            LEFT JOIN emp."user" ON login.id = emp."user".auth_id
            WHERE login.id = ?
        """, (auth_id,))
        row = cursor.fetchone()
 
        if not row:
            conn.close()
            return jsonify({"message": "Employee not found.", "status": "error"}), 404
 
        current_role, current_salary, employeeId, name = row
 
        # Find next role in hierarchy
        try:
            current_index = ROLE_HIERARCHY.index(current_role)
        except ValueError:
            conn.close()
            return jsonify({"message": "Current role not in hierarchy.", "status": "error"}), 400

        if current_index >= len(ROLE_HIERARCHY) - 1:
            conn.close()
            return jsonify({
                "message": "Employee is already at the highest role.",
                "status": "success",
                "newRole": current_role,
                "newLevel": LEVELS.get(current_role, [None])[0],
                "newSalary": current_salary,
            }), 200

        new_role = ROLE_HIERARCHY[current_index + 1]
        new_level = LEVELS[new_role][0]
        new_salary = current_salary + amount

        # Update role in login table
        cursor.execute("UPDATE login SET role = ? WHERE id = ?", (new_role, auth_id))

        if new_department:
            cursor.execute("""
                UPDATE emp."user" SET BaseSalary = ?, department = ? WHERE auth_id = ?
            """, (new_salary, new_department, auth_id))
        else:
            cursor.execute("""UPDATE emp."user" SET BaseSalary = ? WHERE auth_id = ?""", (new_salary, auth_id))

        
        cursor.execute("SELECT email FROM cred_db.login WHERE id = ?", (auth_id,))
        emailRow = cursor.fetchone()
        empEmail = emailRow[0] if emailRow else None

        if empEmail:
            emailService.send_email(
            from_email=emailService.username,
            to_email=empEmail,
            subject="Congratulations on Your Promotion!",
            body=(
                f"Dear {name},\n\n"
                f"You have been promoted!\n\n"
                f"Previous Role   : {current_role}\n"
                f"New Role        : {new_role}\n"
                f"Salary Increment: +{amount}\n"
                f"New Salary      : {new_salary}\n\n"
                f"Best regards,\n\nWorkforceHub"))
            
        conn.commit()
        conn.close()
 
        notifManager.insert_notification(
            employeeId=employeeId,
            role=new_role,
            message=f"Congratulations! You have been promoted to {new_role}. Your new salary is {new_salary}."
        )

        return jsonify({
            "message": f"{name} promoted to {new_role}. Salary updated to {new_salary}.",
            "status": "success",
            "newRole": new_role,
            "newLevel": new_level,
            "newSalary": new_salary
        }), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
 
@users.route("/demote/<string:auth_id>", methods=['POST'])
def demote(auth_id):
    if 'employeeId' not in session or session.get('permission') != 1:
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401
 
    try:
        data = rq.get_json()
        amount = float(data.get("amount", 0))
        new_department = data.get("department", None)
 
        if amount <= 0:
            return jsonify({"message": "Amount must be greater than 0.", "status": "error"}), 400
 
        conn, cursor = user_manager._get_cred_connection()

        
        cursor.execute("""
            SELECT login.role, emp."user".BaseSalary, emp."user".employeeId, emp."user".name
            FROM login
            LEFT JOIN emp."user" ON login.id = emp."user".auth_id
            WHERE login.id = ?
        """, (auth_id,))
        row = cursor.fetchone()
 
        if not row:
            conn.close()
            return jsonify({"message": "Employee not found.", "status": "error"}), 404
 
        current_role, current_salary, employeeId, name = row

        # Find previous role in hierarchy
        try:
            current_index = ROLE_HIERARCHY.index(current_role)
        except ValueError:
            conn.close()
            return jsonify({"message": "Current role not in hierarchy.", "status": "error"}), 400

        if current_index <= 0:
            conn.close()
            return jsonify({
                "message": "Employee is already at the lowest role.",
                "status": "success",
                "newRole": current_role,
                "newLevel": LEVELS.get(current_role, [None])[0],
                "newSalary": current_salary,
            }), 200

        new_role = ROLE_HIERARCHY[current_index - 1]
        new_level = LEVELS[new_role][0]
        new_salary = max(0, current_salary - amount)

        # Update role in login table
        cursor.execute("UPDATE login SET role = ? WHERE id = ?", (new_role, auth_id))

        if new_department:
            cursor.execute("""
                UPDATE emp."user" SET BaseSalary = ?, department = ? WHERE auth_id = ?
            """, (new_salary, new_department, auth_id))
        else:
            cursor.execute("""
                UPDATE emp."user" SET BaseSalary = ? WHERE auth_id = ?
            """, (new_salary, auth_id))


        cursor.execute("SELECT email FROM cred_db.login WHERE id = ?", (auth_id,))
        emailRow = cursor.fetchone()
        empEmail = emailRow[0] if emailRow else None

        if empEmail:
            emailService.send_email(
            from_email=emailService.username,
            to_email=empEmail,
            subject="Update Regarding Your Role",
            body=(
                f"Dear {name},\n\n"
                f"Your role has been updated.\n\n"
                f"Previous Role    : {current_role}\n"
                f"New Role         : {new_role}\n"
                f"Salary Adjustment: -{amount}\n"
                f"New Salary       : {new_salary}\n\n"
                f"Please contact HR if you have any questions.\n\n"
                f"Best regards,\n\nWorkforceHub"))
                
        conn.commit()
        conn.close()

        notifManager.insert_notification(
            employeeId=employeeId,
            role=new_role,
            message=f"You have been demoted to {new_role}. New salary: {new_salary}."
        )

        return jsonify({
            "message": f"{name} demoted to {new_role}. Salary updated to {new_salary}.",
            "status": "success",
            "newRole": new_role,
            "newLevel": new_level,
            "newSalary": new_salary
        }), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@users.route("/bonus/<string:auth_id>", methods=['POST'])
def bonus(auth_id):
    if 'employeeId' not in session or session.get('permission') != 1:
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401
 
    try:
        data = rq.get_json()
        amount = float(data.get("amount", 0))
 
        if amount <= 0:
            return jsonify({"message": "Bonus amount must be greater than 0.", "status": "error"}), 400
 
        conn, cursor = user_manager._get_cred_connection()

        cursor.execute("""
            SELECT emp."user".BaseSalary, emp."user".employeeId, emp."user".name, login.role
            FROM login
            LEFT JOIN emp."user" ON login.id = emp."user".auth_id
            WHERE login.id = ?
        """, (auth_id,))
        row = cursor.fetchone()
 
        if not row:
            conn.close()
            return jsonify({"message": "Employee not found.", "status": "error"}), 404
 
        current_salary, employeeId, name, role = row
        new_salary = current_salary + amount
 
        cursor.execute("""
            UPDATE emp."user" SET BaseSalary = ? WHERE auth_id = ?
        """, (new_salary, auth_id))

        cursor.execute("SELECT email FROM cred_db.login WHERE id = ?", (auth_id,))
        emailRow = cursor.fetchone()
        empEmail = emailRow[0] if emailRow else None

        if empEmail:
            emailService.send_email(
            from_email=emailService.username,
            to_email=empEmail,
            subject="Bonus Credited!",
            body=(
                f"Dear {name},\n\n"
                f"A bonus has been added to your salary.\n\n"
                f"Bonus Amount  : {amount}\n"
                f"Updated Salary: {new_salary}\n\n"
                f"Thank you for your outstanding contribution.\n\n"
                f"Best regards,\n\nWorkforceHub"))
            
        conn.commit()
        conn.close()
 
        notifManager.insert_notification(
            employeeId=employeeId,
            role=role,
            message=f"You have received a bonus of {amount}. Your new salary is {new_salary}."
        )
 
        return jsonify({
            "message": f"Bonus of {amount} applied to {name}. New salary: {new_salary}.",
            "status": "success",
            "newSalary": new_salary
        }), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
@users.route("/updateRole/<string:auth_id>", methods=['POST'])
def updateRole(auth_id):
    if 'employeeId' not in session or session.get('permission') != 1:
        print(session)
        return jsonify({"message": "Unauthorized access.", "status": "error"}), 401
 
    caller_role = session.get('role').lower()
    if caller_role not in ['admin', 'ceo']:
        return jsonify({"message": "Only Admin or CEO can assign roles.", "status": "error"}), 403
 
    try:
        data = rq.get_json()
        new_role = (data.get("role") or "").strip()
        new_department = (data.get("department") or "").strip()

        if not new_role or new_role not in ROLES:
            return jsonify({"message": "Invalid role selected.", "status": "error"}), 400

        new_permission = LEVELS[new_role][1]

        conn, cursor = user_manager._get_cred_connection()
        
        cursor.execute("""
        SELECT emp."user".employeeId, emp."user".name, login.email, login.role
        FROM login
        LEFT JOIN emp."user" ON login.id = emp."user".auth_id
        WHERE login.id = ?
    """, (auth_id,))
        row = cursor.fetchone()

        employeeId, name, empEmail, old_role = row

        if not row:
            conn.close()
            return jsonify({"message": "Employee not found.", "status": "error"}), 404

        cursor.execute("UPDATE login SET role = ? WHERE id = ?", (new_role, auth_id))

        if new_department:
            cursor.execute('UPDATE emp."user" SET department = ? WHERE auth_id = ?', (new_department, auth_id,))
 

        cursor.execute("SELECT email FROM cred_db.login WHERE id = ?", (auth_id,))
        emailRow = cursor.fetchone()
        empEmail = emailRow[0] if emailRow else None

        if empEmail:
            emailService.send_email(
            from_email=emailService.username,
            to_email=empEmail,
            subject="Your Role Has Been Updated",
            body=(
            f"Dear {name},\n\n"
            f"Your role has been officially updated.\n\n"
            f"Previous Role: {old_role}\n"
            f"New Role     : {new_role}\n"
            f"Department   : {new_department or 'Unchanged'}\n\n"
            f"Please log in to the portal to review your updated profile.\n\n"
            f"Best regards,\n\nWorkforceHub"))

        
        notifManager.insert_notification(
            employeeId=employeeId,
            role=new_role,
            message=f"Your role has been updated to {new_role}."
        )
 
        return jsonify({
            "message": f"{name}'s role updated to {new_role}.",
            "status": "success",
            "newRole": new_role,
            "newPermission": new_permission
        }), 200
 
    except Exception as e:
        return jsonify({"error": str(e)}), 500