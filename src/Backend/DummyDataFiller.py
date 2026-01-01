import sqlite3 as sq
import os
import random
from datetime import date, timedelta

# ===============================
# DATABASE PATHS
# ===============================
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")

# ===============================
# LOGIN DATA (20 USERS)
# ===============================
login_data = [
    ("admin@workforce.com", "admin123", "Admin", "Male", "+911111111111"),
    ("ceo@workforce.com", "ceo999", "CEO", "Female", "+912222222222"),
    ("hr@workforce.com", "hr_secure", "HR", "Male", "+913333333333"),
    ("interview@workforce.com", "test456", "Interviewer", "Female", "+914444444444"),
    ("finance@workforce.com", "money123", "Finance", "Male", "+915555555555"),

    ("dev1@workforce.com", "dev123", "Developer", "Male", "+916666666666"),
    ("dev2@workforce.com", "dev123", "Developer", "Female", "+916666666667"),
    ("dev3@workforce.com", "dev123", "Developer", "Male", "+916666666668"),
    ("dev4@workforce.com", "dev123", "Developer", "Female", "+916666666669"),

    ("des1@workforce.com", "des123", "Designer", "Female", "+917777777771"),
    ("des2@workforce.com", "des123", "Designer", "Male", "+917777777772"),
    ("des3@workforce.com", "des123", "Designer", "Female", "+917777777773"),

    ("test1@workforce.com", "qa123", "Tester", "Male", "+918888888881"),
    ("test2@workforce.com", "qa123", "Tester", "Female", "+918888888882"),
    ("test3@workforce.com", "qa123", "Tester", "Male", "+918888888883"),

    ("sales1@workforce.com", "sale123", "Sales manager", "Female", "+919999999991"),
    ("sales2@workforce.com", "sale123", "Sales manager", "Male", "+919999999992"),
    ("sales3@workforce.com", "sale123", "Sales manager", "Female", "+919999999993"),

    ("support1@workforce.com", "help123", "Support", "Male", "+910101010101"),
    ("support2@workforce.com", "help123", "Support", "Female", "+910101010102"),
]

# ===============================
# USER DATA (NO auth_id HERE)
# ===============================
company_user_data = [
    ("System Admin", "LA-0001", "IT Management", "Logged Out", 90000, "2025-12-20 09:00 AM"),
    ("Jane Executive", "LA-0002", "Executive Office", "Logged In", 150000, "2025-12-21 10:30 AM"),
    ("John HR", "LA-0003", "Human Resources", "Logged In", 60000, "2025-12-21 08:45 AM"),
    ("Alice Interviewer", "LA-0004", "Recruitment", "Logged Out", 50000, "2025-12-19 05:15 PM"),
    ("Frank Finance", "LA-0005", "Finance", "Logged In", 80000, "2025-12-21 11:00 AM"),

    ("Dev One", "LA-0011", "Engineering", "Logged In", 70000, "2025-12-21 09:00 AM"),
    ("Dev Two", "LA-0012", "Engineering", "Logged In", 70000, "2025-12-21 09:10 AM"),
    ("Dev Three", "LA-0013", "Engineering", "Logged In", 70000, "2025-12-21 09:20 AM"),
    ("Dev Four", "LA-0014", "Engineering", "Logged In", 70000, "2025-12-21 09:30 AM"),

    ("Designer One", "LA-0015", "Design", "Logged In", 55000, "2025-12-21 10:00 AM"),
    ("Designer Two", "LA-0016", "Design", "Logged In", 55000, "2025-12-21 10:10 AM"),
    ("Designer Three", "LA-0017", "Design", "Logged In", 55000, "2025-12-21 10:20 AM"),

    ("Tester One", "LA-0018", "QA", "Logged In", 45000, "2025-12-21 11:00 AM"),
    ("Tester Two", "LA-0019", "QA", "Logged In", 45000, "2025-12-21 11:10 AM"),
    ("Tester Three", "LA-0020", "QA", "Logged In", 45000, "2025-12-21 11:20 AM"),

    ("Sales One", "LA-0021", "Sales manager", "Logged In", 65000, "2025-12-21 12:00 PM"),
    ("Sales Two", "LA-0022", "Sales manager", "Logged In", 65000, "2025-12-21 12:10 PM"),
    ("Sales Three", "LA-0023", "Sales manager", "Logged In", 65000, "2025-12-21 12:20 PM"),

    ("Support One", "LA-0024", "Support", "Logged In", 35000, "2025-12-21 01:00 PM"),
    ("Support Two", "LA-0025", "Support", "Logged In", 35000, "2025-12-21 01:10 PM"),
]

# ===============================
# STAFF EMP IDS (ATTENDANCE ONLY)
# ===============================
STAFF_EMP_IDS = [u[1] for u in company_user_data[5:]]

# ===============================
# ATTENDANCE GENERATOR
# ===============================
def generate_attendance(year, month):
    records = []
    start = date(year, month, 1)
    end = (start.replace(day=28) + timedelta(days=4)).replace(day=1)

    for emp in STAFF_EMP_IDS:
        current = start
        while current < end:
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

    print("✓ Seed data generated successfully (Users, Attendance, Payroll-ready)")

# ===============================
if __name__ == "__main__":
    populate_databases()
