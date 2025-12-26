#This file is used to run flask file

#pip install flask
#pip install flask-cors

#This is used for creation of files / dir / resources directly to system.
import os 
#sqlite lib
import sqlite3 as sq
from tkinter import messagebox as mb
from flask import Flask,render_template,redirect,session,make_response,jsonify
from flask_cors import CORS
#Get blueprint
from AuthLogin import authlogin
#render_template -> imports function which is used to load html
#redirect -> used to redirect browser to a path
#session -> processing of Sessions
#make_response -> to get a file download/upload response
#request -> to use GET and POST methods
#url_for -> generates automatic path for file.html
#jsonify -> react cannot read direct python objects. we need json
#blueprint -> Divide one massive file to different files. increases modularity

#Create flask application
app = Flask(__name__)

#Register blueprint 
app.register_blueprint(authlogin)

# Enables communication between your React app and this Flask server
CORS(app)  

#os.getcwd() Returns the current working directory
databaseDir = os.path.join(os.getcwd(),"src","Database")
#Returns: HOME/src/Database/
databasePath = os.path.join(databaseDir,"Credentials.db")
#Returns: HOME/src/Database/Credentials.db

def insertSampleCredentials(conn,cursor,template):
    sampleData = [
            ("admin@workforce.com", "admin123", "Admin", "Male"),
            ("ceo@workforce.com", "ceo999", "CEO", "Female"),
            ("hr@workforce.com", "hr_secure", "HR", "Male"),
            ("interview@workforce.com", "test456", "interviewer", "Female"),
            ("sales@workforce.com", "sales789", "Sales manager", "Male"),
            ("intern@workforce.com", "internship", "Intern", "Female"),
            ("design@workforce.com", "creative01", "Designer", "Male"),
            ("dev@workforce.com", "coder99", "Developer", "Female"),
            ("marketing@workforce.com", "promo2025", "Marketing", "Male"),
            ("qa@workforce.com", "bugfree", "Tester", "Female"),
            ("finance@workforce.com", "money123", "Finance", "Male"),
            ("support@workforce.com", "helpdesk", "Support", "Female")]
    cursor.executemany(template,sampleData)
    conn.commit()
    return "Database values recovered."

@app.route("/api/init-db",methods=['GET'])
def createCredentials():
    try:
        if not os.path.exists(databaseDir):
            os.makedirs(databaseDir)

        #Now I want to ensure database file exists. So:
        databaseFileExists = os.path.exists(databasePath)

        #Connect to database
        conn = sq.connect(databasePath)
        #Create cursor
        cursor = conn.cursor()
        #Run query:
        query = '''
        create table if not exists users(id integer primary key autoincrement,email text not null, password text not null, role text not null, gender text not null); 
        ''' 
        #Create template (used when multiple queries to be ran later.)
        template = """
        insert into users(email,password,role,gender) values(?,?,?,?)
        """
        cursor.execute(query)
        conn.commit()

        #A temporary block of code which should be removed later.
        message=""
        if not databaseFileExists:
            message = insertSampleCredentials(conn=conn,cursor=cursor,template=template)
        else:
            message = "Database created. "
            #This json code will be sent to react useeffect
        return jsonify({"message":message}),200
        
    except Exception as e:
        mb.showerror(message=e)

#Run app
if __name__ == '__main__':
    app.run(port=5000,debug=True)
    

