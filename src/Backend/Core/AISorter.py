#This module handles the following:
# 1. AI Resume Sorting
# Natural Language Processing (NLP) models combined with the OpenAI API parse 
# and rank resumes based on job requirements, skills, and experience.
# Generates a shortlist for HR review.

#Recruitment.jsx -> Accept -> send link for interview -> process answers -> get score and description (accept / reject by AI) -> final admission
import re
from dotenv import load_dotenv
from flask import Blueprint
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
            
            return tokenized_text
        except Exception as e:
            print("Error cleaning text:", e)
            return ""
    
    def find_score(self,interview_transcript,chunk):
        try:
            score = 0
            prompt = f"""
Role: You are a Senior Technical Interviewer and fair Evaluator.\n
Task: Grade the candidate's answer based on a 0-10 scale.\n
Evaluation Rules:\n
Semantic Matching: Do not look for exact words. If the candidate explains the concept correctly using different terminology, give full credit for accuracy.\n
Partial Credit: If an answer is partially correct or shows foundational understanding but misses detail, award points proportionally.\n
Technical Depth:\n
10/10: Clear, accurate, and provides a practical example or context.\n
7-9/10: Accurate explanation but lacks a little detail.\n
4-6/10: Understands the concept but explanation is vague.\n
1-3/10: Mentioned related terms but failed to explain the core concept.\n
0/10: No response, blank answer, or completely irrelevant.\n

Strict Penalties:\n
If ANY answer contains "No response", score that question 0 and reduce the total score significantly.\n
If MORE THAN TWO OR ONE answer is "No response", the maximum possible score is 4 out of 10 regardless of other answers.\n
Do not reward confidence or fluency if technical accuracy is missing.\n
No Penalties for Style: Do not penalize for conversational tone or minor grammatical errors.\n

Output Format: Only print the following- Score: X/10\n
Reasoning: One sentence explaining why this score was given, focusing on what was correct or missing.
answers: {interview_transcript} \nResume Chunk: {chunk}
"""
            response = self.generateResponse(prompt)
            response_text = str(response)
            match = re.search(r"Score:\s*(\d+)", response_text, re.IGNORECASE)
            print("Output from src/Core/AISorter.py: ",match)
            if match:
                score = int(match.group(1)) 
                
            return score
            
        except Exception as e:
            print("Error feeding data to AI: ", e)
            return 0
    def find_description(self,interview_transcript=None,chunk=None,scoreByAi=None):
        try:
            print(interview_transcript)
            if not interview_transcript or chunk == None:
                return "Error. The resume seems out-dated and not fit."
            
            history=[]
            history.append(f"p1. You provided score : {scoreByAi}/10 for this resume. ")
            history.append(f"p2. Your task: compare the resume with given answers. Answers: {interview_transcript}")
            
            prompt = f"p3. Based on the resume chunk: {chunk} ,provide a brief description highlighting the candidate's strengths and areas for improvement. Keep it concise and relevant to the job requirements."
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