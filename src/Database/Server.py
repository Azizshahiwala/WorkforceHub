#This file is used to run flask file

#pip install flask
#pip install flask-cors

#This is used for creation of files / dir / resources directly to system.
import os 
#sqlite lib
import sqlite3 as sq

#For error msg
from tkinter import messagebox as mb
from flask import Flask,render_template,redirect,session,make_response,jsonify
from flask import request as rq
from flask import url_for
from flask_cors import CORS

#render_template -> imports function which is used to load html
#redirect -> used to redirect browser to a path
#session -> processing of Sessions
#make_response -> to get a file download/upload response
#request -> to use GET and POST methods
#url_for -> generates automatic path for file.html
#jsonify -> react cannot read direct python objects. we need json

#Create flask application
app = Flask(__name__)

# Enables communication between your React app and this Flask server
CORS(app)  

#os.getcwd() Returns the current working directory
databaseDir = os.path.join(os.getcwd(),"src","Database")
#Returns: HOME/src/Database/
databasePath = os.path.join(databaseDir,"Credentials.db")
#Returns: HOME/src/Database/Credentials.db

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
            sampleData = [("demo111@gmail.com","vivek","Support","Male"),
                      ("demo000@gmail.com","aziz","Marketing","Male"),
                      ("demo999@gmail.com","divya","interviewer","Male")]
            cursor.executemany(template,sampleData)
            conn.commit()
            message = "Database values recovered."
        else:
            message = "Database created. "
            #This json code will be sent to react useeffect
        return jsonify({"message":message}),200
        
    except Exception as e:
        mb.showerror(message=e)

@app.route("/api/Login",methods=['POST'])
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
        cursor.execute("SELECT role FROM users WHERE email = ? AND password = ?", (email, password))
        
        #Fetch just one field output 
        role = cursor.fetchone()
        conn.close()
        if role:
            return jsonify({"success":True,"role":role[0],"message":"Successful match"}),200   
        else:
            return jsonify({"success":False,"role":"","message":"Invalid email or password"}),200  
        #Returning True / False after successful fetch is more reliable. 
    
    except sq.OperationalError as e:
        mb.showwarning(e)
        return jsonify({"success":False,"role":"","message":"User not registered."}),500
    except Exception as e:
        mb.showwarning(e)
        return jsonify({"success":False,"role":"","message":"Un-identified error"}),500
#Run app
if __name__ == '__main__':
    app.run(port=5000,debug=True)
    

