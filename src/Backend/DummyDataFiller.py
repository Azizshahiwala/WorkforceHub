import sqlite3 as sq
import os
import random
from Encrypter import encrypter
from datetime import date, timedelta

DATA = """
    admin@workforce.com - admin123 - Admin - Male - +911111111111
    ceo@workforce.com - ceo999 - CEO - Female - +912222222222
    hr@workforce.com - hr_secure - HR - Male - +913333333333
    interview@workforce.com - test456 - Interviewer - Female - +914444444444
    finance@workforce.com - money123 - Finance - Male - +915555555555

    dev1@workforce.com - dev123 - Developer - Male - +916666666666
    dev2@workforce.com - dev123 - Developer - Female - +916666666667
    dev3@workforce.com - dev123 - Developer - Male - +916666666668
    dev4@workforce.com - dev123 - Developer - Female - +916666666669

    des1@workforce.com - des123 - Designer - Female - +917777777771
    des2@workforce.com - des123 - Designer - Male - +917777777772
    des3@workforce.com - des123 - Designer - Female - +917777777773

    test1@workforce.com - qa123 - Tester - Male - +918888888881
    test2@workforce.com - qa123 - Tester - Female - +918888888882
    test3@workforce.com - qa123 - Tester - Male - +918888888883

    sales1@workforce.com - sale123 - Sales manager - Female - +919999999991
    sales2@workforce.com - sale123 - Sales manager - Male - +919999999992
    sales3@workforce.com - sale123 - Sales manager - Female - +919999999993

    support1@workforce.com - help123 - Support - Male - +910101010101
    support2@workforce.com - help123 - Support - Female - +910101010102

    intern1@workforce.com - freelance - Intern - Female - +910101010103
    intern2@workforce.com - freelance - Intern - Female - +910101010104
"""
print(DATA)
# ===============================
# DATABASE PATHS
# ===============================
from PathConfig import CompanyUserPath,CredentialsPath
# ===============================
# LOGIN DATA (22 USERS)
# ===============================
# Format: (email, password, role, gender, phoneNumber)
login_data = [
    ("admin@workforce.com", encrypter.create_hash("admin123"), "Admin", "Male", "+911111111111"),
    ("ceo@workforce.com", encrypter.create_hash("ceo999"), "CEO", "Female", "+912222222222"),
    ("hr@workforce.com", encrypter.create_hash("hr_secure"), "HR", "Male", "+913333333333"),
    ("interview@workforce.com", encrypter.create_hash("test456"), "Interviewer", "Female", "+914444444444"),
    ("finance@workforce.com", encrypter.create_hash("money123"), "Finance", "Male", "+915555555555"),

    ("dev1@workforce.com", encrypter.create_hash("dev123"), "Developer", "Male", "+916666666666"),
    ("dev2@workforce.com", encrypter.create_hash("dev123"), "Developer", "Female", "+916666666667"),
    ("dev3@workforce.com", encrypter.create_hash("dev123"), "Developer", "Male", "+916666666668"),
    ("dev4@workforce.com", encrypter.create_hash("dev123"), "Developer", "Female", "+916666666669"),

    ("des1@workforce.com", encrypter.create_hash("des123"), "Designer", "Female", "+917777777771"),
    ("des2@workforce.com", encrypter.create_hash("des123"), "Designer", "Male", "+917777777772"),
    ("des3@workforce.com", encrypter.create_hash("des123"), "Designer", "Female", "+917777777773"),

    ("test1@workforce.com", encrypter.create_hash("qa123"), "Tester", "Male", "+918888888881"),
    ("test2@workforce.com", encrypter.create_hash("qa123"), "Tester", "Female", "+918888888882"),
    ("test3@workforce.com", encrypter.create_hash("qa123"), "Tester", "Male", "+918888888883"),

    ("sales1@workforce.com", encrypter.create_hash("sale123"), "Sales manager", "Female", "+919999999991"),
    ("sales2@workforce.com", encrypter.create_hash("sale123"), "Sales manager", "Male", "+919999999992"),
    ("sales3@workforce.com", encrypter.create_hash("sale123"), "Sales manager", "Female", "+919999999993"),

    ("support1@workforce.com", encrypter.create_hash("help123"), "Support", "Male", "+910101010101"),
    ("support2@workforce.com", encrypter.create_hash("help123"), "Support", "Female", "+910101010102"),

    ("intern1@workforce.com", encrypter.create_hash("freelance"), "Intern", "Female", "+910101010103"),
    ("intern2@workforce.com", encrypter.create_hash("freelance"), "Intern", "Female", "+910101010104"),
]
# ===============================
# USER DATA (22 USERS)
# ===============================
# Updated 'department' names to match Dashboard.jsx filter strings
# Format: (name, employeeId, department, status, BaseSalary, lastLogin)
company_user_data = [
    ("Amit Sharma", "LA-0001", "Admin", "Logged Out", 90000, "2025-12-20 09:00 AM"),
    ("Neha Verma", "LA-0002", "CEO", "Logged Out", 150000, "2025-12-21 10:30 AM"),
    ("Rahul Mehta", "LA-0003", "HR", "Logged Out", 60000, "2025-12-21 08:45 AM"),
    ("Pooja Iyer", "LA-0004", "Interviewer", "Logged Out", 50000, "2025-12-19 05:15 PM"),
    ("Suresh Patel", "LA-0005", "Finance", "Logged Out", 80000, "2025-12-21 11:00 AM"),

    ("Arjun Singh", "LA-0011", "Engineering", "Logged Out", 70000, "2025-12-21 09:00 AM"),
    ("Rohit Kumar", "LA-0012", "Engineering", "Logged Out", 70000, "2025-12-21 09:10 AM"),
    ("Vikas Gupta", "LA-0013", "Engineering", "Logged Out", 70000, "2025-12-21 09:20 AM"),
    ("Manish Agarwal", "LA-0014", "Engineering", "Logged Out", 70000, "2025-12-21 09:30 AM"),
    
    ("Ananya Rao", "LA-0015", "Design", "Logged Out", 55000, "2025-12-21 10:00 AM"),
    ("Kavya Nair", "LA-0016", "Design", "Logged Out", 55000, "2025-12-21 10:10 AM"),
    ("Sneha Kulkarni", "LA-0017", "Design", "Logged Out", 55000, "2025-12-21 10:20 AM"),

    ("Pradeep Mishra", "LA-0018", "QA", "Logged Out", 45000, "2025-12-21 11:00 AM"),
    ("Nitin Joshi", "LA-0019", "QA", "Logged Out", 45000, "2025-12-21 11:10 AM"),
    ("Aakash Malhotra", "LA-0020", "QA", "Logged Out", 45000, "2025-12-21 11:20 AM"),

    ("Karan Malhotra", "LA-0021", "Sales", "Logged Out", 65000, "2025-12-21 12:00 PM"),
    ("Deepak Chawla", "LA-0022", "Sales", "Logged Out", 65000, "2025-12-21 12:10 PM"),
    ("Ravi Saxena", "LA-0023", "Sales", "Logged Out", 65000, "2025-12-21 12:20 PM"),

    ("Sunil Yadav", "LA-0024", "Support", "Logged Out", 35000, "2025-12-21 01:00 PM"),
    ("Pankaj Tiwari", "LA-0025", "Support", "Logged Out", 35000, "2025-12-21 01:10 PM"),

    ("Aditya Bansal", "LA-0026", "Engineering", "Logged Out", 25000, "2025-12-21 02:00 PM"),
    ("Riya Jain", "LA-0027", "Engineering", "Logged Out", 25000, "2025-12-21 02:10 PM"),
]

# ===============================
# STAFF EMP IDS (ATTENDANCE ONLY)
# ===============================
# Identifies employees (Staff) for whom we generate random attendance data
STAFF_EMP_IDS = [u[1] for u in company_user_data[5:]]

# ===============================
# ATTENDANCE GENERATOR
# ===============================
def generate_attendance(year, month):
    records = []
    start = date(year, month, 1)
    # Get the last day of the month
    if month == 12:
        end = date(year + 1, 1, 1)
    else:
        end = date(year, month + 1, 1)

    for emp in STAFF_EMP_IDS:
        current = start
        while current < end:
            # Skip weekends (Saturday=5, Sunday=6)
            if current.weekday() < 5:
                status = random.choices(
                    ["Present", "Leave", "Absent"],
                    weights=[80, 12, 8]
                )[0]
                records.append((emp, current.isoformat(), status))
            current += timedelta(days=1)
    return records

# ===============================
# MAIN SEED FUNCTION
# ===============================
def populate_databases():
    # ---------- LOGIN ----------
    conn_c = sq.connect(CredentialsPath)
    cur_c = conn_c.cursor()

    cur_c.execute("DELETE FROM login")

    login_insert = """
        INSERT INTO login(email, password, role, gender, phoneNumber)
        VALUES (?, ?, ?, ?, ?)
    """

    login_id_map = []
    # Use the full length of login_data
    for login_row, user_row in zip(login_data, company_user_data):
        cur_c.execute(login_insert, login_row)
        login_id = cur_c.lastrowid
        login_id_map.append((login_id, user_row))

    conn_c.commit()
    conn_c.close()

    # ---------- USERS ----------
    conn_u = sq.connect(CompanyUserPath)
    cur_u = conn_u.cursor()

    cur_u.execute("DELETE FROM user")
    cur_u.execute("DELETE FROM Attendance")

    user_insert = """
        INSERT INTO user(auth_id, name, employeeId, department, status, BaseSalary, lastLogin)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """

    user_rows = []
    for login_id, user in login_id_map:
        name, empId, dept, status, salary, lastLogin = user
        user_rows.append((login_id, name, empId, dept, status, salary, lastLogin))

    cur_u.executemany(user_insert, user_rows)

    # ---------- ATTENDANCE (2 MONTHS) ----------
    attendance = []
    attendance += generate_attendance(2025, 11)
    attendance += generate_attendance(2025, 12)

    cur_u.executemany(
        "INSERT INTO Attendance(empId, date, status) VALUES (?, ?, ?)",
        attendance
    )

    conn_u.commit()
    conn_u.close()

    print(f"✓ Seed data generated successfully ({len(user_rows)} Users, Attendance records added)")

# ===============================
if __name__ == "__main__":
    populate_databases()