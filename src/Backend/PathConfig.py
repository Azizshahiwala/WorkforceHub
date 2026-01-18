from dotenv import load_dotenv
import os 

load_dotenv()

# Setup Database paths 
def setupPaths():
    databaseDir = os.path.join(os.getcwd(), os.getenv("DATABASE_DIR", "src/Database"))
    CredentialsPath = os.path.join(databaseDir, os.getenv("CREDENTIALS_DB_NAME", "Credentials.db"))
    CompanyUserPath = os.path.join(databaseDir, os.getenv("COMPANY_USER_DB_NAME", "CompanyUsers.db"))
    RecruitmentPath = os.path.join(databaseDir, os.getenv("RECRUITEMENT_DB_NAME", "Recruitment.db"))
    GlobalInfoPath = os.path.join(databaseDir, os.getenv("GLOBALINFO_DB_NAME", "GlobalInfo.db"))
    return CredentialsPath, CompanyUserPath, RecruitmentPath, GlobalInfoPath

CredentialsPath,CompanyUserPath,RecruitmentPath,GlobalInfoPath = setupPaths()