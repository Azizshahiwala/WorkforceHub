import bcrypt
#bcrypt is used to hash a password. This library adds a salt
#(a pseudorandom string ) at the end of password hash.
#At last, on entering pass, we compare the password again with stored hash.

class PasswordEncrypter:
    def __init__(self):
        #Keep for reference in future
        self.hash = ""
        self.bytePass = ""
        
    def create_hash(self,password):

        #Create a psuedo random string.
        salt = bcrypt.gensalt()

        #Convert password to array of bytes
        bytePass = password.encode('utf-8')

        #Create hash
        hash = bcrypt.hashpw(bytePass,salt)

        #Store this hash
        self.hash = hash
        self.bytePass = bytePass

        #return this hash in authlogin.py 
        return self.hash     
    
    def verify_hash(self,password):
        #Convert password to array of bytes
        bytePass = password.encode('utf-8')

        #Check using byte password against hash
        result = bcrypt.checkpw(bytePass,self.hash)

        #Return True / False (result)
        return result
    
encrypter = PasswordEncrypter()
