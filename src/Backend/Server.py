#This file is used to run flask file
from flask import Flask,jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
#Get blueprint
from AuthLogin import authlogin,createCredentials
from Users import users,createCompanyUsers
from Attendance import attendance,createAttendance
from Payroll import payroll,createPayroll
from Recruitment import recruit,createRecruitment
from LeaveHandler import leaveManager,createLeave
from Notification import notification,createNotifs
from FeedbackPerformance import feedbackandperformance,FeedbackPerformanceSetup
from Activity import activity,createActivity
from DummyDataFiller import populate_databases
from PathConfig import setupPaths
from Questionbase import quebase

#Core import 
from Core.AISorter import ai_sorter,ai_sorter_manager
from Core.Limiter import limiter

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
app.register_blueprint(recruit)
app.register_blueprint(leaveManager)
app.register_blueprint(notification)
app.register_blueprint(feedbackandperformance)
app.register_blueprint(activity)
app.register_blueprint(ai_sorter)
app.register_blueprint(quebase)
limiter.init_app(app)
# Enables communication between React app and this Flask server
load_dotenv("../../.env")
allowed_origins = [
    os.getenv("LOCALHOST_PATH"),
    os.getenv("VITE_WEB_PATH"),
    os.getenv("EXTRA_NETWORK_PATH")
]
CORS(app, resources={r"/api/*": {
    "origins": allowed_origins,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]}})
@app.route("/api/init-db",methods=['GET'])
def createDatabases():
    try:
        
        #Setup paths
        setupPaths()
        
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
        
        #Creates leave tables.
        createLeave()

        #Creates central notif table
        createNotifs()

        #Recruitment.db

        #Creates two state tables.
        createRecruitment()
        
        #GlobalInfo.db

        #Create Feedback and Performance tables
        FeedbackPerformanceSetup()

        #Create table for activity (Admin,HR -> employees)
        createActivity()

        #Dummy data filler
        #populate_databases()
        
        return jsonify({"message": "Databases initialized successfully"}), 200
    except Exception as e:
        print(f"Global Init Error: {e}") 
        return jsonify({"error": str(e)}), 500
    
#Run app
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=False)
    

