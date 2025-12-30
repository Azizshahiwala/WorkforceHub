import sqlite3 as sq
import os
from datetime import datetime, timedelta

# Database Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")

# 1. login table data (Matches AuthLogin.py schema)
# Format: (email, password, role, gender, phoneNumber)
login_data = [
    ("admin@workforce.com", "admin123", "Admin", "Male", "+912222222222"),
    ("ceo@workforce.com", "ceo999", "CEO", "Female", "+910000000000"),
    ("hr@workforce.com", "hr_secure", "HR", "Male", "+911234567890"),
    ("interview@workforce.com", "test456", "interviewer", "Female", "+919999999999"),
    ("marshall.n@workforce.com", "sales789", "Sales manager", "Male", "+912222222220"),
    ("maryam.a@workforce.com", "internship", "Intern", "Female" , "+912222222229"),
    ("gary.c@workforce.com", "creative01", "Designer", "Male", "+912222222999"),
    ("frank.c@workforce.com", "coder99", "Developer", "Female", "+914567892304"),
    ("aarav.m@workforce.com", "promo2025", "Marketing", "Male", "+911555555555"),
    ("sophia.t@workforce.com", "bugfree", "Tester", "Female", "+912277889900"),
    ("daniel.r@workforce.com", "money123", "Finance", "Male", "+912225678900"),
    ("priya.s@workforce.com", "helpdesk", "Support", "Female", "+912212121221"),
    ("michael.chen@workforce.com", "backend_pro", "Developer", "Male", "+919876543210"),
    ("robert.k@workforce.com", "learning", "Intern", "Male", "+918887776665"),
    ("emily.w@workforce.com", "pixel_art", "Designer", "Female", "+917778889990"),
    ("aria.g@workforce.com", "no_bugs", "Tester", "Male", "+916665554443"),
    ("james.w@workforce.com", "brand_it", "Marketing", "Female", "+915554443332"),
    ("lisa.t@workforce.com", "assist_u", "Support", "Male", "+914443332221"),
    ("david.s@workforce.com", "budget_it", "Finance", "Female", "+913332221110"),
    ("olivia.b@workforce.com", "pitch_win", "Sales manager", "Female", "+912221110009")
]

# 2. user table data (Matches Users.py schema)
# Format: (auth_id, name, employeeId, department, status, BaseSalary, lastLogin)
company_user_data = [
    (1, "System Admin", "LA-0001", "IT Management", "Logged Out", 40000, "2025-12-20 09:00 AM"),
    (2, "Jane Executive", "LA-0002", "Executive Office", "Logged In", 50000, "2025-12-21 10:30 AM"),
    (3, "John HR", "LA-0003", "Human Resources", "Logged In", 45000, "2025-12-21 08:45 AM"),
    (4, "Alice Interviewer", "LA-0004", "Recruitment", "Logged Out", 48000, "2025-12-19 05:15 PM"),
    (5, "Marshall Nichols", "LA-0012", "Sales", "Logged In", 65000, "2025-12-21 09:15 AM"),
    (6, "Maryam Amiri", "LA-0011", "Sales", "Logged In", 67899, "2025-12-21 08:45 AM"),
    (7, "Gary Camara", "LA-0013", "Product Design", "Logged In", 70000, "2025-12-21 10:20 AM"),
    (8, "Frank Camly", "LA-0014", "Software Engineering", "Logged In", 85000, "2025-12-21 09:00 AM"),
    (9, "Aarav Mehta", "LA-0015", "Marketing Strategy", "Logged In", 75000, "2025-12-21 11:45 AM"),
    (10, "Sophia Turner", "LA-0016", "Quality Assurance", "Logged Out", 65000, "2025-12-21 02:30 PM"),
    (11, "Daniel Roberts", "LA-0017", "Finance", "Logged Out", 85000, "2025-12-20 05:00 PM"),
    (12, "Priya Sharma", "LA-0018", "Customer Success", "Logged In", 70000, "2025-12-20 09:00 AM"),
    (13, "Michael Chen", "LA-0019", "Software Dev", "Logged Out", 85000, "2025-12-19 06:10 PM"),
    (14, "Robert King", "LA-0021", "IT Support", "Logged In", 75000, "2025-12-21 08:00 AM"),
    (15, "Emily Watson", "LA-0022", "UX Research", "Logged In", 85000, "2025-12-21 07:45 AM"),
    (16, "Aria Gupta", "LA-0023", "Automation testing", "Logged Out", 65433, "2025-12-18 11:00 AM"),
    (17, "James Wilson", "LA-0024", "Growth Marketing", "Logged In", 75000, "2025-12-21 09:30 AM"),
    (18, "Lisa Thompson", "LA-0025", "Support Desk", "Logged In", 75000, "2025-12-21 08:15 AM"),
    (19, "David Smith", "LA-0026", "Accounts", "Logged Out", 85000, "2025-12-20 04:45 PM"),
    (20, "Olivia Brown", "LA-0027", "Regional Sales", "Logged In", 75000, "2025-12-25 09:00 AM")
]

# 3. Attendance Data
attendance_data_to_insert = [
    ("LA-0011", "2025-12-01", "Present"), ("LA-0011", "2025-12-02", "Present"),
    ("LA-0011", "2025-12-03", "Present"), ("LA-0011", "2025-12-04", "Leave"),
    ("LA-0011", "2025-12-05", "Present"), ("LA-0011", "2025-12-06", "Absent"),
    ("LA-0011", "2025-12-07", "Present"), ("LA-0011", "2025-12-08", "Present"),
    ("LA-0011", "2025-12-09", "Present"), ("LA-0011", "2025-12-10", "Leave")
]

def populate_databases():

    # 1. Populating login table in Credentials.db
    conn_c = sq.connect(CredentialsPath)
    cur_c = conn_c.cursor()
    cur_c.execute("DROP TABLE IF EXISTS login")
    cur_c.execute("""
        CREATE TABLE login(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT, password TEXT, role TEXT, gender TEXT, phoneNumber TEXT UNIQUE
        )""")
    # Direct insert (no alias prefix needed when connected directly)
    template_c = "INSERT INTO login(email, password, role, gender, phoneNumber) VALUES(?,?,?,?,?);"
    cur_c.executemany(template_c, login_data)
    conn_c.commit()
    conn_c.close()

    # 2. Populating user table in CompanyUsers.db
    conn_u = sq.connect(CompanyUserPath)
    cur_u = conn_u.cursor()
    cur_u.execute("DROP TABLE IF EXISTS user")
    cur_u.execute("""
        CREATE TABLE user(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            auth_id INTEGER UNIQUE, name TEXT, employeeId TEXT UNIQUE, 
            department TEXT, status TEXT, lastLogin TEXT, BaseSalary REAL
        )""")
    template_u = "INSERT INTO user(auth_id, name, employeeId, department, status, BaseSalary, lastLogin) VALUES(?,?,?,?,?,?,?)"
    cur_u.executemany(template_u, company_user_data)
    conn_u.commit()
    conn_u.close()
    
    # Fill Login
    conn_c = sq.connect(CredentialsPath)
    conn_c.execute("DELETE FROM login")
    template_c = "INSERT INTO login(email, password, role, gender, phoneNumber) VALUES(?,?,?,?,?)"
    conn_c.executemany(template_c, login_data)
    conn_c.commit()
    conn_c.close()
    print("✓ Credentials.db populated.")

    # Fill User
    conn_u = sq.connect(CompanyUserPath)
    conn_u.execute("DELETE FROM user")
    conn_u.execute("DELETE FROM Attendance")
    
    template_u = """
        INSERT INTO user(auth_id, name, employeeId, department, status, BaseSalary, lastLogin) 
        VALUES(?,?,?,?,?,?,?)
    """
    conn_u.executemany(template_u, company_user_data)
    
    template_a = "INSERT INTO Attendance (empId, date, status) VALUES (?, ?, ?)"
    conn_u.executemany(template_a, attendance_data_to_insert)
    
    conn_u.commit()
    conn_u.close()
    print("✓ CompanyUsers.db populated.")

if __name__ == "__main__":
    populate_databases()