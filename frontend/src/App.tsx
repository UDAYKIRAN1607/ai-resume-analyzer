// import { useState } from 'react'
// import UploadPanel from './components/UploadPanel'
// import ResultPanel from './components/ResultPanel'
// import { parseAnalysis } from './utils/parseAnalysis'
// import type { AnalysisResult } from './types'

// export default function App() {
//   const [resume, setResume] = useState<File | null>(null)
//   const [jobDescription, setJobDescription] = useState('')
//   const [result, setResult] = useState<AnalysisResult | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async () => {
//     if (!resume || !jobDescription.trim()) {
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
//       setResult(parseAnalysis(data.analysis))
//     } catch {
//       setError('Failed to connect to backend. Make sure the server is running.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#0a0f1e',
//       fontFamily: "'DM Sans', sans-serif",
//       color: '#e2e8f0',
//       padding: '16px',
//       boxSizing: 'border-box',
//     }}>
//       <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />

//       {/* Header */}
//       <div style={{ textAlign: 'center', marginBottom: 12 }}>
//         <div style={{
//           display: 'inline-block',
//           background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//           borderRadius: 12,
//           padding: '4px 14px',
//           fontSize: 11,
//           fontWeight: 600,
//           letterSpacing: 2,
//           marginBottom: 10,
//           color: '#fff'
//         }}>
//           POWERED BY GROQ AI
//         </div>
//         <h1 style={{
//           fontSize: 28,
//           fontWeight: 700,
//           fontFamily: "'Space Mono', monospace",
//           background: 'linear-gradient(135deg, #e2e8f0 0%, #6366f1 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           marginBottom: 6,
//           lineHeight: 1.2
//         }}>
//           Resume Analyzer
//         </h1>
//         <p style={{ color: '#64748b', fontSize: 13 }}>
//           Upload your resume · Paste a JD · Get your AI match score
//         </p>
//       </div>

//       {/* Split Layout */}
//       <div style={{
//         display: 'flex',
//         gap: 20,
//         maxWidth: 1100,
//         margin: '0 auto',
//         alignItems: 'stretch',
//       }}>
//         <UploadPanel
//           resume={resume}
//           jobDescription={jobDescription}
//           loading={loading}
//           error={error}
//           onResumeChange={setResume}
//           onJDChange={setJobDescription}
//           onSubmit={handleSubmit}
//         />
//         <ResultPanel
//           result={result}
//           loading={loading}
//         />
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import UploadPanel from './components/UploadPanel'
import ResultPanel from './components/ResultPanel'
import { parseAnalysis } from './utils/parseAnalysis'
import type { AnalysisResult } from './types'

export default function App() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamText, setStreamText] = useState('')

  const handleSubmit = async () => {
    if (!resume || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setStreamText('')

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze-stream', {
        method: 'POST',
        body: formData,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          fullText += chunk
          setStreamText(fullText)
        }
      }

      // Once streaming is complete, show result after small delay
      const parsed = parseAnalysis(fullText)
      setTimeout(() => {
        setResult(parsed)
        setStreamText('')
      }, 1500)

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
      padding: '16px',
      boxSizing: 'border-box',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 12,
          padding: '4px 14px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2,
          marginBottom: 10,
          color: '#fff'
        }}>
          POWERED BY GROQ AI
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "'Space Mono', monospace",
          background: 'linear-gradient(135deg, #e2e8f0 0%, #6366f1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 6,
          lineHeight: 1.2
        }}>
          Resume Analyzer
        </h1>
        <p style={{ color: '#64748b', fontSize: 13 }}>
          Upload your resume · Paste a JD · Get your AI match score
        </p>
      </div>

      {/* Split Layout */}
      <div style={{
        display: 'flex',
        gap: 20,
        maxWidth: 1100,
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        <UploadPanel
          resume={resume}
          jobDescription={jobDescription}
          loading={loading}
          error={error}
          onResumeChange={setResume}
          onJDChange={setJobDescription}
          onSubmit={handleSubmit}
        />
        <ResultPanel
          result={result}
          loading={loading}
          streamText={streamText}
        />
      </div>
    </div>
  )
}