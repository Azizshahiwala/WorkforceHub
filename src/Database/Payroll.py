#This file fetches data from CompanyUserdb -> attendance table
#Salary is calcuated based on month. i.e How much days an employee has worked in a month.
#Tax is deducted if applicable.
#Salary structure will be shown using react. 
#When mail option clicked,payslip / any document will be sent to employee email.
import sqlite3 as sq
from flask import Blueprint,jsonify,request as rq
import os

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")

payroll = Blueprint('Payroll',__name__,url_prefix='/api')

class Payroll:
    def __init__(self,CompanyUserPath,CredentialsPath):
        self.CompanyUserPath = CompanyUserPath
        self.CredentialsPath = CredentialsPath
    
    def _get_connection(self):
        conn = sq.connect(self.CompanyUserPath)
        conn.execute("PRAGMA foreign_keys=ON;")
        cursor = conn.cursor()
        cursor.execute(f"ATTACH DATABASE '{self.CredentialsPath}' AS cred_db")
        return conn,cursor
    
    def create_table(self):
        conn,cursor = self._get_connection()
        Payrolltable = """
        create table if not exists Payroll(
        id integer primary key autoincrement,
        empId text not null,
        MonthYear text not null,
        TotalDaysLoggedIn integer not null,
        BaseSalary real,
        TaxAmount real,
        ProvidentFund real,
        ProfessionalTax real,
        GrossSalary real,
        NetSalary real,
        foreign key (empId) references "user"(employeeId));
        """
        cursor.execute(Payrolltable)
        conn.commit()
        conn.close()
    def SalaryBreakup(self,empId,MonthYear):

        conn,cursor = self._get_connection()
        #Get phone and id from cred_db.login
        Keys = """
        SELECT login.phoneNumber, emp.employeeId, emp.name
        FROM cred_db.login AS login
        LEFT JOIN "user" AS emp ON login.id = emp.auth_id
        WHERE emp.employeeId = ?;
        """

        cursor.execute(Keys,(empId,))

        keydata = cursor.fetchone()
        #print("Payroll.py Keydata fetch:",keydata)
        if not keydata:
            conn.close()
            return None, "Employee credentials not linked"
        #Get base salary

        fetchBaseSal = """
        select BaseSalary from "user" where employeeId = ?;"""

        cursor.execute(fetchBaseSal,(empId,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None," Employee not found."
        
        BaseSalary = float(row[0])

        #Now get total days for a single emp.

        fetchEmpTotalDay = """
            SELECT count(*) FROM Attendance 
            WHERE empId = ? AND (status = 'Present' OR status = 'Logged in') 
            AND date LIKE ?;
        """
        cursor.execute(fetchEmpTotalDay,(empId,MonthYear+"%"))
        TotalDays = cursor.fetchone()[0]
        print("Payroll.py TotalDays fetch:",TotalDays)
        
        taxamount = 0.0
        ProvidentFund = 0.0
        professionaltax = 0.0
        if BaseSalary >= 0.0 and BaseSalary <= 300000:
            taxamount = 0.0
        elif BaseSalary > 300000 and BaseSalary <=700000:
            taxamount = BaseSalary * 0.05
        elif BaseSalary > 700000 and BaseSalary <=1000000:
            taxamount = BaseSalary * 0.1
        elif BaseSalary > 1000000 and BaseSalary <=1200000:
            taxamount = BaseSalary * 0.15
        else:
            taxamount = BaseSalary * 0.2
        
        LossOfPay = (BaseSalary / 30) * (30 - TotalDays)
        GrossSalary = BaseSalary
        NetSalary = GrossSalary - (taxamount + ProvidentFund + professionaltax + LossOfPay)
        conn.close()
        
        result = [{
        "empId": empId,
        "phoneNumber": keydata[0],
        "name": keydata[2],
        "MonthYear": MonthYear,
        "daysWorked": TotalDays,
        "BaseSalary": BaseSalary,
        "TaxAmount": taxamount,
        "ProvidentFund": ProvidentFund,
        "ProfessionalTax": professionaltax,
        "LossOfPay": LossOfPay,
        "GrossSalary": GrossSalary,
        "NetSalary": NetSalary,
        "generatedAt": MonthYear
    }]
        return result,None
        #print(f"Salary Breakup Data for {empId}:",result)
        

    def processAndSaveData(self,empId,MonthYear):
        conn,cursor = self._get_connection()
        #Get base salary
        fetchBaseSal = """
        select BaseSalary from "user" where employeeId = ?;"""

        cursor.execute(fetchBaseSal,(empId,))
        BaseEmpSal = cursor.fetchone()

        #Now get total days for a single emp.

        fetchEmpTotalDay = """
        select count(*) from Attendance where empId = ? and (status = 'Present' or status = 'Logged in') and date like ?;
        """
        cursor.execute(fetchEmpTotalDay,(empId,MonthYear))
        TotalDays = cursor.fetchone()[0]

        if not BaseEmpSal:
            conn.close()
            print(f"Employee not found: {empId},{MonthYear}")
            return jsonify("Employee not found."),401
        else:
            BaseEmpSal = BaseEmpSal[0]

        taxamount = 0.0
        ProvidentFund = 0.0
        professionaltax = 0.0

        if BaseEmpSal >= 0 and BaseEmpSal <= 300000:
            taxamount = 0.0
        elif BaseEmpSal > 300000 and BaseEmpSal <=700000:
            taxamount = BaseEmpSal * 0.05
        elif BaseEmpSal > 700000 and BaseEmpSal <=1000000:
            taxamount = BaseEmpSal * 0.1
        elif BaseEmpSal > 1000000 and BaseEmpSal <=1200000:
            taxamount = BaseEmpSal * 0.15
        else:
            taxamount = BaseEmpSal * 0.2
        
        LossOfPay = (BaseEmpSal / 30) * (30 - TotalDays)
        GrossSalary = BaseEmpSal
        NetSalary = GrossSalary - (taxamount + ProvidentFund + professionaltax + LossOfPay)
        #Insert leave records from Leave.py / LeaveManager.jsx
        
        storeData = """
        insert into Payroll(empId,MonthYear,TotalDaysLoggedIn,BaseSalary,TaxAmount,ProvidentFund,ProfessionalTax,GrossSalary,NetSalary)
        values (?,?,?,?,?,?,?,?,?);
        """
        cursor.execute(storeData,(empId,MonthYear,TotalDays,BaseEmpSal,taxamount,ProvidentFund,professionaltax,GrossSalary,NetSalary))

        conn.commit()
        result = [{"empId":empId,
                   "daysWorked":TotalDays,
                   "BaseSalary":BaseEmpSal,
                   "TaxAmount":taxamount,
                   "ProvidentFund":ProvidentFund,
                   "ProfessionalTax":professionaltax,
                   "GrossSalary":GrossSalary,
                   "NetSalary":NetSalary}]

        conn.close()
        return result
Paymanager = Payroll(CompanyUserPath,CredentialsPath)

def createPayroll():
    Paymanager.create_table()

#Data is passed from frontend : empId,MonthYear
#Used to display salary breakup
@payroll.route("/pay-Salarybreakup/<string:empId>/<string:MonthYear>",methods=['GET'])
def returnSalBreakup(empId,MonthYear):
    data,error = Paymanager.SalaryBreakup(empId,MonthYear)

    if error:
        return jsonify({"error": error}), 404
    
    #print("Payroll raw data: ",data)
    return jsonify(data),200

#Data is sent to frontend
#Used to store and process salary details
@payroll.route("/pay-gateway/<string:empId>",methods=['POST'])
def payrollprocess(empId):
    #Data from: 
    #/pay-gateway/empId (for calculation)
    #id -> internal source
    #empId -> user table
    #MonthYear -> data inserted on month and year (2025-12)
    #TotalDaysLoggedIn -> attendance table
    #BaseSalary -> fetched from user table
    #taxamount -> backend calculation
    #ProvidentFund -> backend 
    #ProfessionalTax -> backend 

    try:
        data = rq.json
        MonthYear = data.get("MonthYear")
        result = Paymanager.processAndSaveData(empId,MonthYear)
        return jsonify(result),200
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
