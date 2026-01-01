import { useState, useEffect } from 'react'

const analysisSteps = [
  { text: 'Analyzing depth of field...', icon: '🔍' },
  { text: 'Detecting light sources...', icon: '💡' },
  { text: 'Extracting color palette...', icon: '🎨' },
  { text: 'Estimating focal length...', icon: '📷' },
  { text: 'Mapping shadows...', icon: '🌑' },
  { text: 'Generating recommendations...', icon: '✨' },
]

function LoadingAnalysis({ imagePreview }) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <img
            src={imagePreview}
            alt="Uploaded"
            className="w-full rounded-xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent rounded-xl" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 text-white">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-sm font-medium">Processing image...</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">
            Analyzing Your Shot
          </h3>

          {analysisSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                index === currentStep
                  ? 'bg-amber-500/20 border border-amber-500/50'
                  : index < currentStep
                  ? 'bg-slate-800/50 opacity-50'
                  : 'bg-slate-800/30 opacity-30'
              }`}
            >
              <span className="text-xl">{step.icon}</span>
              <span className={`text-sm ${index === currentStep ? 'text-white' : 'text-slate-400'}`}>
                {step.text}
              </span>
              {index === currentStep && (
                <div className="ml-auto">
                  <div className="animate-pulse w-2 h-2 bg-amber-500 rounded-full" />
                </div>
              )}
              {index < currentStep && (
                <svg className="ml-auto w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingAnalysis
