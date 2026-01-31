#This module handles the following:
# 1. AI Resume Sorting
# Natural Language Processing (NLP) models combined with the OpenAI API parse 
# and rank resumes based on job requirements, skills, and experience.
# Generates a shortlist for HR review.

#Recruitment.jsx -> Accept -> send link for interview -> process answers -> get score and description (accept / reject by AI) -> final admission
from http import client
from http import client
import re
from dotenv import load_dotenv
from flask import Blueprint,json,jsonify
import requests
from google import genai
import pdfplumber
import io 
import os 
ai_sorter = Blueprint('ai_sorter', __name__, url_prefix='/api')

#My env file is in src/ folder. so i go 2 steps back.
env_path = os.path.join(os.getcwd(),'..','..','.env')
load_dotenv(env_path)
class AISorter:
    def __init__(self, key, model="gemini-2.5-flash"):
        
        self.__key = key 
        self.__model = model
        self.__client =genai.Client(api_key=self.__key)
        
    def convert_data_to_str(self,binary_data):
        try:
            #Convert binary data to file like object.
            binary_stream = io.BytesIO(binary_data)

            #Now use pdfplumber to open object and extract text.
            with pdfplumber.open(binary_stream) as pdf:
                text = ""
                #iterate over pages
                for page in pdf.pages:
                    #keep appending text
                    text += page.extract_text()
            return text
        except Exception as e:
            print("Error decoding binary data: ", e)
            return ""
        
    def clean_text(self,text):
        try:
            
            text = text.strip('\n')
            #Now we remove common words 
            common_words = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with','*','|','-']
            #This logic says: put all words that are not in common_words into a list
            tokenized_text = [word for word in text.split() if word.lower() not in common_words]
            print("Text cleaned: ",tokenized_text)
            return tokenized_text
        except Exception as e:
            print("Error cleaning text:", e)
            return ""
    
    def find_score(self,chunk):
        try:
            score = 0
            
            prompt = f"On a scale of 1 to 10, how well does the following resume chunk match the job requirements and skills? Resume Chunk: {chunk} . Give score number only."
            response = self.generateResponse(prompt,None)
            match = re.search(r'\d+', str(response))
            if match:
                score = int(match.group())

            return score 
        except Exception as e:
            print("Resume does not have required data: ", e)
            return 0
    def find_description(self,chunk,scoreByAi=None):
        try:
            history=[]
            history.append(f"p. You are an expert HR professional specializing in recruitment and talent acquisition.")
            history.append(f"p1. You provided score : {scoreByAi}/10 for this resume. ")
            history.append(f"p2. Check for: Age, Work background, skills, cultural fit, strengths, weaknesses, experience and hobbies.")
            prompt = f"p4. Based on the resume chunk: {chunk} ,provide a brief description highlighting the candidate's strengths and areas for improvement. Keep it concise and relevant to the job requirements."
            response = self.generateResponse(prompt,history)
            return response
        except Exception as e:
            print("Resume does not have required data: ", e)
            return "" 
    def generateResponse(self,prompt,*items):
        try:
            if len(items)==0:
                items=[[]]
                response = self.__client.models.generate_content(
                model=self.__model,
                contents=prompt)
            else:
                response = self.__client.models.generate_content(
                model=self.__model,
                contents=items[0]+[prompt])

            return response.text
        except Exception as e:
            print("Error generating response from AI: ", e)
            return ""
ai_sorter_manager = AISorter(os.getenv("API_KEY"))