import ScoreRing from './ScoreRing'
import { type AnalysisResult } from '../types'

interface Props {
  result: AnalysisResult | null
  loading: boolean
}

export default function ResultPanel({ result, loading }: Props) {
  return (
    <div style={{
      flex: 1,
      background: '#111827',
      borderRadius: 20,
      border: '1.5px solid #1e293b',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: loading || !result ? 'center' : 'flex-start',
      alignItems: loading || !result ? 'center' : 'flex-start',
      minHeight: 'auto',
    }}>

      {/* Empty state */}
      {!result && !loading && (
        <div style={{ textAlign: 'center', color: '#334155' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>Your analysis will appear here</p>
          <p style={{ fontSize: 12, marginTop: 4 }}>Upload a resume and paste a JD to get started</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', color: '#6366f1' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>Analyzing your resume...</p>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Groq AI is reviewing your profile</p>
        </div>
      )}

      {/* Result state */}
      {result && !loading && (
        <div style={{ width: '100%' }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          {/* Score + Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 12, animation: 'fadeIn 0.5s ease' }}>
            <ScoreRing score={parseInt(result.score)} />
            <div>
              <p style={{ fontSize: 11, color: '#64748b', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>MATCH SCORE</p>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{result.summary}</p>
            </div>
          </div>

          {/* Matching Skills */}
          <div style={{ background: '#0a1a0f', border: '1px solid #14532d', borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: 1, marginBottom: 10 }}>✓ MATCHING SKILLS</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {result.matching.map((skill, i) => (
                <span key={i} style={{
                  background: '#14532d', color: '#86efac',
                  padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500
                }}>{skill}</span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 1, marginBottom: 10 }}>✗ MISSING SKILLS</p>
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
      )}
    </div>
  )
}