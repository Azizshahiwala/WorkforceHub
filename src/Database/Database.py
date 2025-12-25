import os
import sqlite3 as sq
from tkinter import messagebox
class Server:
    def __init__(self,credentials):
        print("Checking for databases...")
        #Pass credentials db
        self.__credentials = credentials
        self.createDatabase(self.__credentials)
        
    def createDatabase(credentials):
        try:
            conn = sq.connect()
            
        except Exception as e:
            messagebox.showerror(e)