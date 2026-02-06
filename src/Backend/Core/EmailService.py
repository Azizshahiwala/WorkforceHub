#Recruitement
#Send invite links via emails
#source: https://docs.python.org/3/library/smtplib.html
import os
import smtplib
from dotenv import load_dotenv

class EmailService:
    def __init__(self):
        #smtp_server -> SMTP server address (in my case its gmail)
        #smpt_port -> SMTP server port (587 for TLS)
        load_dotenv("../../.env")
        
        self.smtp_server = os.getenv("smtp_server")
        self.smtp_port = int(os.getenv("smtp_port"))
        self.username = os.getenv("smtp_username")
        self.password = os.getenv("smtp_password")
        self.api_url = os.getenv("VITE_API_BASE_URL")
        self.web_url = os.getenv("VITE_WEB_PATH")
    def create_connection(self):
        #this takes HOST and PORT (smtp_server, smtp_port)
        try:
            smtp = smtplib.SMTP(self.smtp_server, self.smtp_port,timeout=10)
            
            if not smtp:
                print("Aborting send: No connection.")
                return False
        
            statuscode,response = smtp.ehlo()
            print("[] Echoing server: ",statuscode,response)
            statuscode,response = smtp.starttls()
            print("[] Start TLS server: ",statuscode,response)
            statuscode,response = smtp.login(self.username, self.password)
            print("[] Login status: ",statuscode,response)
            statuscode = None 
            response = None 
            print("[] SMTP connection established successfully.")
            return smtp
        except Exception as e:
            print(f"Error creating connection: {e}")
    def send_email(self, from_email, to_email, subject, body):
        try:
            #return smtp connection obj.
            smtp = self.create_connection()
            
            #Create email
            message = f"Subject: {subject}\n\n{body}"
            
            #Now send email using from, to and msg.
            smtp.sendmail(from_email, to_email, message)

            print(f"Email sent successfully to {to_email}")
            
            #close the connection
            smtp.quit()
        except Exception as e:
            print(f"Error sending email: {e}")
    def createLink(self, Tempid):
        #This function creates a unique link for interview.
        # ?ref is used to track the tempid in the link.
        #jsx will capture this ref and use it to return the interview data.
        return f"{self.web_url}/interviewer?ref={Tempid}"
    
    def sendInterviewLink(self, to_email, candidate_name, Tempid):
        from_email = self.username
        subject = "Interview Invitation"
        interview_link = self.createLink(Tempid)
        body = f"Dear {candidate_name},\n\nYou are invited to attend an AI interview. Please use the following link to join the interview during working hours.\n\n{interview_link}\n\nBest regards,\nHR Team"
        
        self.send_email(from_email, to_email, subject, body)
    
    
emailService = EmailService()
