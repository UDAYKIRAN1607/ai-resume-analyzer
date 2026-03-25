# AI Resume + Job Match Analyzer 🎯

An AI-powered resume analyzer that compares your resume against a job description and returns a match score, matching skills, missing skills, and a summary — powered by **Groq AI (LLaMA 3.3)** and **LangChain**.

![Python](https://img.shields.io/badge/Python-FastAPI-blue?style=flat-square&logo=python)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange?style=flat-square&logo=chainlink)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=flat-square&logo=groq)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-green?style=flat-square)
![Render](https://img.shields.io/badge/Deployed-Render-blue?style=flat-square&logo=render)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## 🌐 Live Demo

- 🚀 **Frontend:** Coming soon
- 🔧 **Backend API:** Coming soon

> **Note:** Backend is hosted on Render free tier — first request may take 30-60 seconds to wake up.

---

## 🚀 Features

### ✅ Implemented

- Upload resume as PDF — text extracted automatically
- Paste any job description for comparison
- **AI-powered match score** out of 100
- **Matching skills** — top skills that align with the JD
- **Missing skills** — key gaps identified by AI
- **One-line summary** — concise recruiter-style analysis
- FastAPI backend with auto-generated Swagger UI at `/docs`
- LangChain prompt pipeline with Groq AI (LLaMA 3.3-70b-versatile)
- CORS enabled — ready for React frontend integration
- Environment variable management with python-dotenv

### 🔜 Coming Soon

- ChromaDB vector database integration for RAG-based matching
- React + TypeScript frontend with match score progress bar
- Skill badges — matched vs missing visual display
- Full deployment on Render + Vercel

---

## 🛠 Tech Stack

### Backend
- Python 3.14
- FastAPI
- LangChain + LangChain-Groq
- ChromaDB (Vector Database)
- PyPDF2 (PDF text extraction)
- Groq AI SDK (`llama-3.3-70b-versatile`)
- python-dotenv

### Frontend (In Progress)
- React.js + TypeScript
- Tailwind CSS

### Deployment
- Backend → Render
- Frontend → Vercel

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── main.py          # FastAPI app — routes, PDF parsing, AI analysis
├── .env             # Environment variables (not committed)
├── .gitignore       # Excludes venv, .env, __pycache__
└── venv/            # Python virtual environment (not committed)
```

---

## 🔌 API Endpoints

### Core
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check — API status |
| POST | `/analyze` | Upload resume PDF + JD → AI match analysis |

### Request Format (`/analyze`)
- `resume` — PDF file upload
- `job_description` — Job description as text

### Response Format
```json
{
  "analysis": "Match Score: 80/100\nMatching Skills: React.js, TypeScript, Node.js\nMissing Skills: AI/LLM integration, Docker, GraphQL\nSummary: Strong candidate with relevant frontend experience.",
  "message": "Analysis complete!"
}
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Python 3.11+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
git clone https://github.com/UDAYKIRAN1607/ai-resume-analyzer.git
cd ai-resume-analyzer
```

Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

Install dependencies:
```bash
pip install fastapi uvicorn python-multipart pypdf2 langchain langchain-groq langchain-core chromadb python-dotenv
```

Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key
```

Run the server:
```bash
uvicorn main:app --reload
```

API will be live at `http://127.0.0.1:8000`

Test via Swagger UI at `http://127.0.0.1:8000/docs`

---

## 👨‍💻 Author

**M S Uday Kiran**  
Full Stack Developer | [GitHub](https://github.com/UDAYKIRAN1607)
