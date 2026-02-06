#This file fetches data from CompanyUserdb -> attendance table
#Salary is calcuated based on month. i.e How much days an employee has worked in a month.
#Tax is deducted if applicable.
#Salary structure will be shown using react. 
#When mail option clicked,payslip / any document will be sent to employee email.
import sqlite3 as sq
import calendar
from flask import Blueprint,jsonify,request as rq
from PathConfig import CompanyUserPath,CredentialsPath
from LeaveHandler import leavehandler
from Notification import notifManager
from Core.EmailService import emailService

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
        PaidLeaves INTEGER DEFAULT 0, 
        AbsentDays INTEGER DEFAULT 0,
        BaseSalary real,
        TaxAmount real,
        ProvidentFund real,
        ProfessionalTax real,
        GrossSalary real,
        NetSalary real,
        foreign key (empId) references "user"(employeeId) ON DELETE CASCADE);
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
        #print("Payroll.py TotalDays fetch:",TotalDays)
        
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

        #get paid leaves
        paid_leaves = leavehandler.get_leave_count(empId, MonthYear)
        
        #Split and get year, month individually
        year,month = map(int,MonthYear.split('-'))

        #Now calculate days by using range function from calendar
        _, days_in_month = calendar.monthrange(year, month)
        
        #Now calc absent days
        absent_days = days_in_month - (TotalDays + paid_leaves)

        if absent_days < 0:
            absent_days = 0

        #Now at last, calc lossofpay
        LossOfPay = (BaseSalary / days_in_month) * absent_days
        GrossSalary = BaseSalary
        NetSalary = GrossSalary - (taxamount + ProvidentFund + professionaltax + LossOfPay)
        conn.close()
        
        result = [{
        "empId": empId,
        "phoneNumber": keydata[0],
        "name": keydata[2],
        "MonthYear": MonthYear,
        "daysWorked": TotalDays,
        "paidLeaves": paid_leaves,
        "absentDays": absent_days,
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
        
        data_list, error = self.SalaryBreakup(empId, MonthYear)
        if error:
            print(f"Error calculating data: {error}")
            return None
        
        item = data_list[0]

        conn,cursor = self._get_connection()

        fetchEmpTotalDay = """
            SELECT count(*) FROM Attendance 
            WHERE empId = ? AND (status = 'Present' OR status = 'Logged in') 
            AND date LIKE ?;
        """
        cursor.execute(fetchEmpTotalDay,(empId,MonthYear+"%"))
        TotalDays = cursor.fetchone()[0]

        storeData = """
        insert into Payroll(empId,MonthYear,TotalDaysLoggedIn,PaidLeaves, AbsentDays,BaseSalary,TaxAmount,ProvidentFund,ProfessionalTax,GrossSalary,NetSalary)
        values (?,?,?,?,?,?,?,?,?,?,?);
        """
        cursor.execute(storeData,(empId,MonthYear,item['daysWorked'],item['paidLeaves'],item['absentDays'],item['BaseSalary'],item['TaxAmount'],item['ProvidentFund'],item['ProfessionalTax'],item['GrossSalary'],item['NetSalary']))

        conn.commit()
        result = [{"empId":empId,
                   "daysWorked":item['daysWorked'],
                   "BaseSalary":round(item['BaseSalary'],2),
                   "TaxAmount":item['TaxAmount'],
                   "ProvidentFund":item['ProvidentFund'],
                   "ProfessionalTax":item['ProfessionalTax'],
                   "LossOfPay": round(item['LossOfPay'],2),
                   "GrossSalary":round(item['GrossSalary'],2),
                   "NetSalary":round(item['NetSalary'],2)}]

        conn.close()
        print("ProcessAndSaveData complete")
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
    
    print("Payroll raw data: ",data)
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
    role = ""
    try:
        formdata = rq.get_json()
        MonthYear = formdata.get("MonthYear")
        emailTo = formdata.get("emailTo")
        empName = formdata.get("empName")
        #Get role for notification.
        conn , cursor = Paymanager._get_connection()
        
        cursor.execute("SELECT auth_id FROM 'user' WHERE employeeId = ?", (empId,))
        data = cursor.fetchone()
        auth_id = data[0]
        
        cursor.execute("SELECT role FROM cred_db.login WHERE id = ?", (auth_id,))
        data = cursor.fetchone()
        role = data[0]

        print("Payroll process to: ",role,auth_id)
        conn.close()

        result = Paymanager.processAndSaveData(empId,MonthYear)
        if result:
            notifManager.insert_notification(employeeId=empId,role=role,message="Please check your email. Your salary has been paid for this month.")
            sendFinalMail(emailTo=emailTo,empId=empId,empName=empName,MonthYear=MonthYear)
        print("Payrollprocess complete")
        return jsonify(result),200
    except Exception as e:
        print("Payrollprocess",e)
        return jsonify({"error":str(e)}),500
    
def sendFinalMail(emailTo,empId,empName,MonthYear):
#This fetches salary breakup and sends email to employee.
    try:
        #We need the following: emailfrom, emailto, name(optional), monthyear :)
        emailFrom = emailService.username
        
        salarydata, error = Paymanager.SalaryBreakup(empId, MonthYear)

        if error:
            return jsonify({"error": error}), 404

        #email content
        subject = f"Salary Details for {MonthYear}"
        body = f"Dear {empName},\n\nHere are your salary details for {MonthYear}:\n\n"
        for item in salarydata:
            body += (f"Employee ID: {item['empId']}\n"
                     f"Name: {item['name']}\n"
                     f"Days Worked: {item['daysWorked']}\n"
                     f"Base Salary: {item['BaseSalary']}\n"
                     f"Tax Amount: {item['TaxAmount']}\n"
                     f"Provident Fund: {item['ProvidentFund']}\n"
                     f"Professional Tax: {item['ProfessionalTax']}\n"
                     f"Loss of Pay (un-paid leaves): {item['LossOfPay']}\n"
                     f"Gross Salary: {item['GrossSalary']}\n"
                     f"Net Salary: {item['NetSalary']}\n\n")
        body += "Best regards,\nPayroll Department"
        body += '\n\nDo not reply to this email.'

        # Send email
        emailService.send_email(from_email=emailFrom, to_email=emailTo, subject=subject, body=body)
        print("sendFinalMail complete")
    except Exception as e:
        print("sendFinalMail",e)
        pass 

