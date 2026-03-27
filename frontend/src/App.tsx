// import { useState } from 'react'

// function App() {
//   const [resume, setResume] = useState<File | null>(null)
//   const [jobDescription, setJobDescription] = useState('')
//   const [result, setResult] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async () => {
//     if (!resume || !jobDescription) {
//       setError('Please upload a resume and enter a job description')
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setResult(null)

//     const formData = new FormData()
//     formData.append('resume', resume)
//     formData.append('job_description', jobDescription)

//     try {
//       const response = await fetch('http://127.0.0.1:8000/analyze', {
//         method: 'POST',
//         body: formData,
//       })
//       const data = await response.json()
//       setResult(data.analysis)
//     } catch (err) {
//       setError('Something went wrong. Make sure the backend is running.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const parseResult = (text: string) => {
//     const lines = text.split('\n').filter(line => line.trim())
//     return lines
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">AI Resume Analyzer</h1>
//           <p className="text-gray-500 mt-2">Upload your resume and paste a job description to get an AI match score</p>
//         </div>

//         {/* Upload Card */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">

//           {/* Resume Upload */}
//           <div className="mb-5">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Upload Resume (PDF)
//             </label>
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={(e) => setResume(e.target.files?.[0] || null)}
//               className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-600"
//             />
//             {resume && (
//               <p className="text-green-600 text-sm mt-1">✓ {resume.name} selected</p>
//             )}
//           </div>

//           {/* Job Description */}
//           <div className="mb-5">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Job Description
//             </label>
//             <textarea
//               rows={6}
//               placeholder="Paste the job description here..."
//               value={jobDescription}
//               onChange={(e) => setJobDescription(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <p className="text-red-500 text-sm mb-4">{error}</p>
//           )}

//           {/* Submit Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
//           >
//             {loading ? 'Analyzing...' : 'Analyze Resume'}
//           </button>
//         </div>

//         {/* Result Card */}
//         {result && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Analysis Result</h2>
//             <div className="space-y-3">
//               {parseResult(result).map((line, index) => (
//                 <p key={index} className="text-gray-700 text-sm border-b border-gray-100 pb-2">
//                   {line}
//                 </p>
//               ))}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   )
// }

// export default App
import { useState, useRef } from 'react'

interface AnalysisResult {
  score: string
  matching: string[]
  missing: string[]
  summary: string
}

function parseAnalysis(text: string): AnalysisResult {
  const scoreMatch = text.match(/Match Score:\s*(\d+)\/100/)
  const matchingMatch = text.match(/Matching Skills:\s*(.+)/)
  const missingMatch = text.match(/Missing Skills:\s*(.+)/)
  const summaryMatch = text.match(/Summary:\s*(.+)/)

  return {
    score: scoreMatch ? scoreMatch[1] : '0',
    matching: matchingMatch ? matchingMatch[1].split(',').map(s => s.trim()) : [],
    missing: missingMatch ? missingMatch[1].split(',').map(s => s.trim()) : [],
    summary: summaryMatch ? summaryMatch[1] : '',
  }
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span style={{ fontSize: 32, fontWeight: 800, color, fontFamily: "'Space Mono', monospace" }}>{score}</span>
        <span style={{ fontSize: 11, color: '#64748b', letterSpacing: 2 }}>OUT OF 100</span>
      </div>
    </div>
  )
}

export default function App() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') setResume(file)
    else setError('Only PDF files are supported')
  }

  const handleSubmit = async () => {
    if (!resume || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setResult(parseAnalysis(data.analysis))
    } catch {
      setError('Failed to connect to backend. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      fontFamily: "'DM Sans', sans-serif",
      color: '#e2e8f0',
      padding: '20px 16px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 12,
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 2,
            marginBottom: 16,
            color: '#fff'
          }}>
            POWERED BY GROQ AI
          </div>
          <h1 style={{
            fontSize: 42,
            fontWeight: 700,
            fontFamily: "'Space Mono', monospace",
            background: 'linear-gradient(135deg, #e2e8f0 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 12,
            lineHeight: 1.2
          }}>
            Resume Analyzer
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>
            Upload your resume · Paste a JD · Get your AI match score
          </p>
        </div>

        {/* Upload Area */}
        <div style={{
          background: '#111827',
          border: `2px dashed ${dragOver ? '#6366f1' : '#1e293b'}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          textAlign: 'center'
        }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
          {resume ? (
            <div>
              <p style={{ color: '#22c55e', fontWeight: 600, fontSize: 15 }}>✓ {resume.name}</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Click to change file</p>
            </div>
          ) : (
            <div>
              <p style={{ color: '#94a3b8', fontWeight: 500 }}>Drop your resume here or click to browse</p>
              <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>PDF only · Max 10MB</p>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: 1, marginBottom: 8 }}>
            JOB DESCRIPTION
          </label>
          <textarea
            rows={4}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{
              width: '100%',
              background: '#111827',
              border: '1.5px solid #1e293b',
              borderRadius: 12,
              padding: '14px 16px',
              fontSize: 14,
              color: '#e2e8f0',
              resize: 'none',
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = '#1e293b'}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#1c0a0a', border: '1px solid #7f1d1d',
            borderRadius: 10, padding: '12px 16px',
            color: '#f87171', fontSize: 14, marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#1e293b' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: loading ? '#475569' : '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '16px',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            fontFamily: "'Space Mono', monospace",
            transition: 'all 0.2s',
            marginBottom: 32
          }}
        >
          {loading ? '⏳ ANALYZING...' : '→ ANALYZE RESUME'}
        </button>

        {/* Result */}
        {result && (
          <div style={{
            background: '#111827',
            border: '1.5px solid #1e293b',
            borderRadius: 20,
            padding: 32,
            animation: 'fadeIn 0.5s ease'
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 }}>
              <ScoreRing score={parseInt(result.score)} />
              <div>
                <p style={{ fontSize: 13, color: '#64748b', letterSpacing: 1, marginBottom: 6 }}>MATCH SCORE</p>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>{result.summary}</p>
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Matching */}
              <div style={{ background: '#0a1a0f', border: '1px solid #14532d', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', letterSpacing: 1, marginBottom: 12 }}>
                  ✓ MATCHING SKILLS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.matching.map((skill, i) => (
                    <span key={i} style={{
                      background: '#14532d', color: '#86efac',
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500
                    }}>{skill}</span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', letterSpacing: 1, marginBottom: 12 }}>
                  ✗ MISSING SKILLS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.missing.map((skill, i) => (
                    <span key={i} style={{
                      background: '#7f1d1d', color: '#fca5a5',
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500
                    }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}