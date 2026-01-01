import { useState, useEffect } from 'react'
import ImageUploader from './components/ImageUploader'
import AnalysisResults from './components/AnalysisResults'
import LoadingAnalysis from './components/LoadingAnalysis'

const API_URL = import.meta.env.VITE_API_URL || ''

function App() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [showDonationPrompt, setShowDonationPrompt] = useState(false)

  const handleImageUpload = async (file) => {
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
    setIsAnalyzing(true)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)

      // Track analysis count for donation prompt
      const count = parseInt(localStorage.getItem('analysisCount') || '0') + 1
      localStorage.setItem('analysisCount', count.toString())

      // Show donation prompt every 5 analyses (after 5, 10, 15, etc.)
      const lastPrompt = parseInt(localStorage.getItem('lastDonationPrompt') || '0')
      if (count >= 5 && count - lastPrompt >= 5) {
        setTimeout(() => setShowDonationPrompt(true), 1500)
        localStorage.setItem('lastDonationPrompt', count.toString())
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/40">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                {/* F letter */}
                <path
                  d="M6 6H15V9H9V14H14V17H9V26H6V6Z"
                  fill="white"
                />
                {/* M letter */}
                <path
                  d="M17 6H20L23 14L26 6H29V26H26V12L23 20H23L20 12V26H17V6Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FrameMatch</h1>
              <p className="text-xs text-slate-400">Analyze & Recreate Any Shot</p>
            </div>
          </div>
          {(image || analysisResult) && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
            >
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!image && !analysisResult && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Decode Any Shot
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Upload a reference image from a film, photograph, or screenshot.
              Get instant technical analysis of camera settings, lighting, and color grade.
            </p>
          </div>
        )}

        {!image && <ImageUploader onUpload={handleImageUpload} />}

        {isAnalyzing && <LoadingAnalysis imagePreview={imagePreview} />}

        {error && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {analysisResult && (
          <AnalysisResults
            result={analysisResult}
            imagePreview={imagePreview}
          />
        )}
      </main>

      <footer className="border-t border-slate-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500">
          <span>
            FrameMatch by{' '}
            <a href="https://www.e-studios.net" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              e-studios
            </a>
          </span>
          <span className="hidden sm:inline">|</span>
          <a
            href="https://paypal.me/elvisbrahm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Support with a donation
          </a>
        </div>
      </footer>

      {/* Donation Prompt Modal */}
      {showDonationPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enjoying FrameMatch?</h3>
              <p className="text-slate-400 mb-6">
                This tool is free and ad-free. If it's helping your creative work, consider supporting its development with a small donation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://paypal.me/elvisbrahm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  Donate via PayPal
                </a>
                <button
                  onClick={() => setShowDonationPrompt(false)}
                  className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-4">
                You won't see this again for a while
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
