# AI Resume + Job Match Analyzer 🎯

An AI-powered resume analyzer that compares your resume against a job description and returns a match score, matching skills, missing skills, and a summary — powered by **Groq AI (LLaMA 3.3)**, **LangChain**, and **ChromaDB RAG pipeline**.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green?style=flat-square&logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-RAG-orange?style=flat-square)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-purple?style=flat-square)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=flat-square)
![React](https://img.shields.io/badge/React-TypeScript-blue?style=flat-square&logo=react)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?style=flat-square&logo=render)

---

## 🌐 Live Demo

- 🚀 **Frontend:** https://ai-resume-analyzer-fawn-alpha.vercel.app
- 🔧 **Backend API:** https://ai-resume-analyzer-2a4y.onrender.com

> **Note:** Backend is hosted on Render free tier — first request may take 30-60 seconds to wake up.

---

## 🚀 Features

- Upload resume as PDF — text extracted automatically
- Paste any job description for comparison
- **RAG Pipeline** — resume chunked, embedded via ChromaDB ONNX, semantically searched
- **AI-powered match score** out of 100
- **Matching skills** — top skills that align with the JD
- **Missing skills** — key gaps identified by AI
- **One-line summary** — concise recruiter-style analysis
- **Streaming responses** — results appear token by token (ChatGPT-like typing effect)
- Split layout UI — no scrolling, everything visible at once
- Dark premium UI with score ring visualization
- FastAPI backend with auto-generated Swagger UI at `/docs`

---

## 🧠 How It Works (RAG Pipeline)

```
PDF Upload → Text Extraction (PyPDF2)
         → Text Chunking (LangChain RecursiveCharacterTextSplitter)
         → Vector Embeddings (ChromaDB ONNX — all-MiniLM-L6-v2)
         → Semantic Search (ChromaDB similarity search)
         → Top 3 Relevant Chunks → Groq AI (LLaMA 3.3-70b)
         → Match Score + Skills + Summary (Streamed)
```

---

## 🛠 Tech Stack

### Backend
- Python 3.11
- FastAPI + Uvicorn
- LangChain + LangChain-Groq
- ChromaDB (Vector Database with ONNX embeddings)
- PyPDF2 (PDF text extraction)
- Groq AI SDK (`llama-3.3-70b-versatile`)
- StreamingResponse (real-time token streaming)
- python-dotenv

### Frontend
- React.js + TypeScript
- Vite
- Tailwind CSS
- Custom Score Ring component
- Streaming fetch with ReadableStream API

### Deployment
- Backend → Render
- Frontend → Vercel

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── main.py                     # FastAPI app — RAG pipeline + streaming
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (not committed)
├── .gitignore
├── README.md
├── chroma_db/                  # ChromaDB persistent storage (not committed)
└── frontend/                   # React + TypeScript frontend
    └── src/
        ├── components/
        │   ├── UploadPanel.tsx  # Left panel — PDF upload + JD input
        │   ├── ResultPanel.tsx  # Right panel — score ring + skill badges
        │   └── ScoreRing.tsx    # Animated SVG score ring
        ├── types/
        │   └── index.ts         # TypeScript interfaces
        ├── utils/
        │   └── parseAnalysis.ts # Parse AI response into structured data
        └── App.tsx              # Main app — streaming logic + split layout
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/analyze` | Upload resume + JD → full JSON response |
| POST | `/analyze-stream` | Upload resume + JD → streamed token response |

### Request Format
- `resume` — PDF file upload
- `job_description` — Job description as text

### Response Format
```json
{
  "analysis": "Match Score: 80/100\nMatching Skills: React.js, TypeScript, Node.js\nMissing Skills: AI/LLM integration, Docker\nSummary: Strong candidate with relevant frontend experience.",
  "message": "Analysis complete!"
}
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Python 3.11
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
git clone https://github.com/UDAYKIRAN1607/ai-resume-analyzer.git
cd ai-resume-analyzer
py -3.11 -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `.env`:
```
GROQ_API_KEY=your_groq_api_key
```

Run:
```bash
uvicorn main:app --reload
```

API live at `http://127.0.0.1:8000` — Swagger UI at `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend live at `http://localhost:5173`

---

## 👨‍💻 Author

**M S Uday Kiran**
Full Stack Developer | Applied GenAI Engineer
[GitHub](https://github.com/UDAYKIRAN1607) | [LinkedIn](https://www.linkedin.com/in/m-s-uday-kiran-0a7b9b1b4)
