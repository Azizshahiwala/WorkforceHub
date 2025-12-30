#This file is used to run flask file

#pip install flask
#pip install flask-cors

from tkinter import messagebox as mb
from flask import Flask,session,make_response,jsonify
from flask_cors import CORS
#Get blueprint
from AuthLogin import authlogin,createCredentials
from Users import users,createCompanyUsers
from Attendance import attendance,createAttendance
from Payroll import payroll,createPayroll
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
app.register_blueprint(users)
app.register_blueprint(attendance)
app.register_blueprint(payroll)

# Enables communication between your React app and this Flask server
CORS(app)  

@app.route("/api/init-db",methods=['GET'])
def createDatabases():
    try:
        #Credentials.db

        #Creates main login table
        createCredentials()

        #CompanyUsers.db

        #Creates user table (profile)
        createCompanyUsers()

        #Creates attendance table
        createAttendance()
        
        #Creates payroll table.
        createPayroll()
        
        return jsonify({"message": "Databases initialized successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#Run app
if __name__ == '__main__':
    app.run(port=5000,debug=True)
    

