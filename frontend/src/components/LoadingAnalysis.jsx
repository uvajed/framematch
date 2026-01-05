import { useState, useEffect } from 'react'

const analysisSteps = [
  { text: 'Reading image metadata', code: 'EXIF' },
  { text: 'Analyzing depth of field', code: 'DOF' },
  { text: 'Detecting light sources', code: 'LUX' },
  { text: 'Extracting color palette', code: 'RGB' },
  { text: 'Analyzing tone curve', code: 'CURVE' },
  { text: 'Generating recommendations', code: 'AI' },
]

function LoadingAnalysis({ imagePreview }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analysisSteps.length - 1) {
          return prev
        }
        return prev + 1
      })
    }, 800)

    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 100)
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(timeInterval)
    }
  }, [])

  const estimatedDuration = 5000
  const progress = Math.min((elapsedTime / estimatedDuration) * 100, 95)

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Image preview with monitor frame */}
        <div className="monitor-frame">
          <div className="monitor-screen">
            <div className="relative aspect-video">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />

              {/* Scanline overlay */}
              <div className="absolute inset-0 scanlines" />

              {/* Processing overlay */}
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.4) 40%, transparent 100%)' }} />

              {/* Viewfinder corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2"
                   style={{ borderColor: 'var(--accent-primary)' }} />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2"
                   style={{ borderColor: 'var(--accent-primary)' }} />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2"
                   style={{ borderColor: 'var(--accent-primary)' }} />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2"
                   style={{ borderColor: 'var(--accent-primary)' }} />

              {/* Status bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Spinning aperture animation */}
                    <div className="relative w-6 h-6">
                      <svg className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.3" />
                        <path
                          d="M12 2a10 10 0 0 1 10 10"
                          stroke="var(--accent-primary)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                      PROCESSING
                    </span>
                  </div>
                  <span className="font-mono text-sm" style={{ color: 'var(--accent-primary)' }}>
                    {Math.round(progress)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-default)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out progress-glow"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                    }}
                  />
                </div>
              </div>

              {/* Recording indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full"
                   style={{ background: 'rgba(0,0,0,0.6)' }}>
                <span className="indicator-dot rec-indicator" style={{ background: 'var(--tech-red)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                  ANALYZING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis steps */}
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ background: 'var(--surface-default)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-xl tracking-wide" style={{ color: 'var(--text-primary)' }}>
                ANALYZING FRAME
              </h3>
              <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                {analysisSteps[currentStep]?.code || 'INIT'}
              </p>
            </div>
          </div>

          {/* Steps list */}
          <div className="space-y-2">
            {analysisSteps.map((step, index) => {
              const isActive = index === currentStep
              const isComplete = index < currentStep
              const isPending = index > currentStep

              return (
                <div
                  key={index}
                  className="relative flex items-center gap-4 p-4 rounded-lg transition-all duration-300"
                  style={{
                    background: isActive ? 'rgba(245, 166, 35, 0.1)' : 'var(--bg-secondary)',
                    border: `1px solid ${isActive ? 'rgba(245, 166, 35, 0.3)' : 'var(--border-dim)'}`,
                    opacity: isPending ? 0.4 : 1
                  }}
                >
                  {/* Status indicator */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                       style={{
                         background: isComplete
                           ? 'var(--tech-green)'
                           : isActive
                             ? 'var(--accent-primary)'
                             : 'var(--surface-default)'
                       }}>
                    {isComplete ? (
                      <svg className="w-4 h-4" style={{ color: 'var(--bg-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isActive ? (
                      <div className="w-4 h-4 border-2 rounded-full animate-spin"
                           style={{ borderColor: 'var(--bg-primary)', borderTopColor: 'transparent' }} />
                    ) : (
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate"
                       style={{ color: isActive ? 'var(--text-primary)' : isComplete ? 'var(--text-secondary)' : 'var(--text-tertiary)' }}>
                      {step.text}
                    </p>
                  </div>

                  {/* Code badge */}
                  <div className="flex-shrink-0">
                    <span className="font-mono text-xs px-2 py-1 rounded"
                          style={{
                            background: isActive ? 'rgba(245, 166, 35, 0.2)' : 'var(--surface-dim)',
                            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)'
                          }}>
                      {step.code}
                    </span>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r"
                         style={{ background: 'var(--accent-primary)' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Time elapsed */}
          <div className="mt-6 flex items-center justify-between px-4">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Elapsed time
            </span>
            <span className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
              {(elapsedTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnalysis
