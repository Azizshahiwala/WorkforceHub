from dotenv import load_dotenv
import os 


base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir,"PathConfig.env"))
# Setup Database paths 
def setupPaths():
    
    databaseDir = os.path.join(os.getcwd(), os.getenv("DATABASE_DIR", "Database"))
    print("Final db dir:",databaseDir)
    os.makedirs(databaseDir, exist_ok=True)
    CredentialsPath = os.path.join(databaseDir, os.getenv("CREDENTIALS_DB_NAME", "Credentials.db"))
    CompanyUserPath = os.path.join(databaseDir, os.getenv("COMPANY_USER_DB_NAME", "CompanyUsers.db"))
    RecruitmentPath = os.path.join(databaseDir, os.getenv("RECRUITEMENT_DB_NAME", "Recruitment.db"))
    GlobalInfoPath = os.path.join(databaseDir, os.getenv("GLOBALINFO_DB_NAME", "GlobalInfo.db"))
    return CredentialsPath, CompanyUserPath, RecruitmentPath, GlobalInfoPath

CredentialsPath,CompanyUserPath,RecruitmentPath,GlobalInfoPath = setupPaths()