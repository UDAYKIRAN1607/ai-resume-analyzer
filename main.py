from http import client
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
import chromadb
from chromadb.utils import embedding_functions


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

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def get_relevant_chunks(resume_text: str, job_description: str) -> str:
    # Split resume text into smaller chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks = splitter.split_text(resume_text)

    # Initialize ChromaDB persistent client — saves to disk
    client = chromadb.PersistentClient(path="./chroma_db")

    # Use ChromaDB's built-in ONNX embedding function (no PyTorch needed)
    ef = embedding_functions.DefaultEmbeddingFunction()

    # Delete old collection to avoid duplicate ID errors on re-analysis
    try:
        client.delete_collection(name="resume_chunks")
    except:
        pass

    # Create fresh collection with embedding function
    collection = client.create_collection(
        name="resume_chunks",
        embedding_function=ef
    )

    # Add resume chunks to ChromaDB — embeddings generated automatically
    collection.add(
        documents=chunks,
        ids=[f"chunk_{i}" for i in range(len(chunks))]
    )

    # Query ChromaDB with job description — semantic similarity search
    results = collection.query(
        query_texts=[job_description],
        n_results=3
    )

    # Return top 3 most relevant chunks
    relevant_text = "\n".join(results['documents'][0])
    return relevant_text

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
    resume_text = extract_text_from_pdf(pdf_bytes)

    # Get relevant chunks using RAG
    relevant_text = get_relevant_chunks(resume_text, job_description)

    # Run AI analysis with relevant chunks
    result = chain.invoke({
        "resume": relevant_text,
        "job_description": job_description
    })

    return {
        "analysis": result.content,
        "message": "Analysis complete!"
    }