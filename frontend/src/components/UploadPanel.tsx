import { useRef } from 'react'

interface Props {
    resume: File | null
    jobDescription: string
    loading: boolean
    error: string | null
    onResumeChange: (file: File) => void
    onJDChange: (value: string) => void
    onSubmit: () => void
}

export default function UploadPanel({
    resume, jobDescription, loading, error,
    onResumeChange, onJDChange, onSubmit
}: Props) {
    const fileRef = useRef<HTMLInputElement>(null)

    return (
        <div style={{
            flex: 1,
            background: '#111827',
            borderRadius: 20,
            border: '1.5px solid #1e293b',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 'auto',
        }}>

            {/* Upload Area */}
            <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    RESUME (PDF)
                </label>
                <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                        border: '2px dashed #1e293b',
                        borderRadius: 12,
                        padding: 20,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation() }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const f = e.dataTransfer.files[0]
                        if (f) onResumeChange(f)
                    }}
                >
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) onResumeChange(f) }}
                    />
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                    {resume ? (
                        <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600 }}>✓ {resume.name}</p>
                    ) : (
                        <p style={{ color: '#475569', fontSize: 13 }}>Drop PDF here or click to browse</p>
                    )}
                </div>
            </div>

            {/* Job Description */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    JOB DESCRIPTION
                </label>
                <textarea
                    rows={6}
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => onJDChange(e.target.value)}
                    style={{
                        flex: 1,
                        background: '#0d1424',
                        border: '1.5px solid #1e293b',
                        borderRadius: 12,
                        padding: '12px 14px',
                        fontSize: 13,
                        color: '#e2e8f0',
                        resize: 'none',
                        outline: 'none',
                        fontFamily: "'DM Sans', sans-serif",
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
                    borderRadius: 10, padding: '10px 14px',
                    color: '#f87171', fontSize: 13
                }}>
                    {error}
                </div>
            )}

            {/* Button */}
            <button
                onClick={onSubmit}
                disabled={loading}
                style={{
                    width: '100%',
                    background: loading ? '#1e293b' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: loading ? '#475569' : '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '14px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    letterSpacing: 1,
                    fontFamily: "'Space Mono', monospace",
                    transition: 'all 0.2s',
                }}
            >
                {loading ? '⏳ ANALYZING...' : '→ ANALYZE RESUME'}
            </button>
        </div>
    )
}