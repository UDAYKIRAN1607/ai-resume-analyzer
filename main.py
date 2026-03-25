from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

prompt = PromptTemplate(
    input_variables=["resume", "job_description"],
    template="""
You are an expert recruiter and resume analyst.

Compare this resume with the job description and provide:
1. A match score out of 100
2. Top 3 matching skills
3. Top 3 missing skills
4. One line summary

Resume:
{resume}

Job Description:
{job_description}

Respond in this exact format:
Match Score: [score]/100
Matching Skills: [skill1], [skill2], [skill3]
Missing Skills: [skill1], [skill2], [skill3]
Summary: [one line summary]
"""
)

chain = prompt | llm

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer API is running!"}

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Extract text from PDF
    pdf_bytes = await resume.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    
    resume_text = ""
    for page in pdf_reader.pages:
        resume_text += page.extract_text()

    # Run AI analysis
    result = chain.invoke({
        "resume": resume_text[:3000],
        "job_description": job_description
    })

    return {
        "analysis": result.content,
        "message": "Analysis complete!"
    }