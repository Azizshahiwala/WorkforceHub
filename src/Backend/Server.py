#This file is used to run flask file
from flask import Flask,jsonify,session
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
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

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
CORS(app, resources={r"/api/*": {"origins": allowed_origins,"methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],"allow_headers": ["Content-Type", "Authorization"],"supports_credentials": True}})
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

        #Dummy data output
        DATA = """
    admin@workforce.com - admin123 - Admin - Male - +911111111111
    ceo@workforce.com - ceo999 - CEO - Female - +912222222222
    hr@workforce.com - hr_secure - HR - Male - +913333333333
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
        
        return jsonify({"message": "Databases initialized successfully"}), 200
    except Exception as e:
        print(f"Global Init Error: {e}") 
        return jsonify({"error": str(e)}), 500
    
#Run app
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
    

