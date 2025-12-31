#This file is entry point for resume uploading.
#This step creates separate react file for resume uploading feature.
#Then it is sent to Recruitement.jsx
#when approved, it is stored in db. Once approved, registered user cannot access this portal.
#If rejected, entry is deleted and guest can try to upload again.

from flask import request as rq
from flask import Blueprint,jsonify
import os 
import sqlite3 as sq

recruitment = Blueprint('Recruitment', __name__, url_prefix='/api')

# Paths
databaseDir = os.path.join(os.getcwd(), "src", "Database")
CompanyUserPath = os.path.join(databaseDir, "CompanyUsers.db")
CredentialsPath = os.path.join(databaseDir, "Credentials.db")
#This is where our resume will be stored.
#This will be, Document Repository
RecruitmentPath = os.path.join(databaseDir, "Recruitment.db")

class Recruitment:
    pass 

def createRecruitment():
    pass
