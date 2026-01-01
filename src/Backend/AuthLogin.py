#This file checks Staff: Sales manager, Intern, Designer, Developer, Marketing
#Marketing, tester, finance, support.
#Non-Staff:

#Admin -> dashboardAdmin
#HR -> dashboard

#Staff -> Employee dashboard
from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq
def createCredentials():
    try:
        if not os.path.exists(databaseDir):
            os.makedirs(databaseDir)

        #Connect to database
        conn = sq.connect(databasePath)
        conn.execute("PRAGMA foreign_keys = ON;")
        #Create cursor
        cursor = conn.cursor()
        #Run query:
        query = '''
        create table if not exists login(id integer primary key autoincrement,email text not null, password text not null, role text not null, gender text not null, phoneNumber text not null unique); 
        ''' 
        #Create template (used when multiple queries to be ran later.)
        cursor.execute(query)
        conn.commit()
        conn.close()
        return True
        
    except Exception as e:
        print(e)
        
def isStaff(role):
    staff = ["Sales manager", "Intern", "Designer", "Developer", 
    "Marketing", "Tester", "Finance", "Support"]
    
    # for security check, we trim and lower the string.
    # and then we compare role with individual staff.
    staffmap = [item.lower() == role.lower() for item in staff]

    #Map How much roles match as boolean values and use any() to check that
    #ANY ONE value should be true.
    if any(staffmap):
        return True
    
    return False
def isNonStaff(role):
    nonstaff = ["Admin", "CEO", "HR","Interviewer"]
    nonstaffmap = [item.lower() == role.lower() for item in nonstaff]
    
    if any(nonstaffmap):
        return True
    
    return False

authlogin = Blueprint('Auth',__name__,url_prefix='/api')

#os.getcwd() Returns the current working directory
databaseDir = os.path.join(os.getcwd(),"src","Database")
#Returns: HOME/src/Database/
databasePath = os.path.join(databaseDir,"Credentials.db")
#Returns: HOME/src/Database/Credentials.db

@authlogin.route("/Login",methods=['POST'])
def login():
    role=None
    try:
        #This function will fetch email and password from react website when form button is clicked. It will wait for response
        data = rq.json
        email = data.get("email")
        password = data.get("password")

        #Connect to database
        conn = sq.connect(databasePath)
        #Create cursor
        cursor = conn.cursor()

        #To grant access according to user role, and to check if pass and mail exists, we fetch role using both param. 
        cursor.execute("SELECT role FROM login WHERE email = ? AND password = ?", (email, password))
        
        #Fetch just one field output 
        role = cursor.fetchone()
        conn.close()

        if role:
            print(role)
            res = role[0]
            if isStaff(res):
                return jsonify({"success":True,"role":res,"message":"Successful match","Permission":2}),200 
            elif isNonStaff(res):
                return jsonify({"success":True,"role":res,"message":"Successful match","Permission":1}),200      
            else:
                return jsonify({"success":False,"role":"","message":"Invalid email or password","Permission":0}),200       
        #Returning True / False after successful fetch is more reliable. 
        
    except sq.OperationalError as e:
        print(e)
        return jsonify({"success":False,"role":"","message":"User not registered."}),500
    except Exception as e:
        print(e)
        return jsonify({"success":False,"role":"","message":"Un-identified error"}),500
