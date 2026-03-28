import type { AnalysisResult } from '../types'

export function parseAnalysis(text: string): AnalysisResult {
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