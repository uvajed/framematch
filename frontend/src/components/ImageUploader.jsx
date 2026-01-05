import { useCallback, useState } from 'react'

function ImageUploader({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }, [onUpload])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
    }
  }, [onUpload])

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Main upload zone with viewfinder aesthetic */}
      <div
        className="relative cursor-pointer group"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        {/* Outer frame */}
        <div
          className="relative rounded-xl p-8 transition-all duration-300"
          style={{
            background: isDragging
              ? 'rgba(245, 166, 35, 0.05)'
              : 'var(--bg-secondary)',
            border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-default)'}`,
          }}
        >
          {/* Viewfinder corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 rounded-tl transition-colors duration-300"
               style={{ borderColor: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 rounded-tr transition-colors duration-300"
               style={{ borderColor: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 rounded-bl transition-colors duration-300"
               style={{ borderColor: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }} />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 rounded-br transition-colors duration-300"
               style={{ borderColor: isDragging ? 'var(--accent-primary)' : 'var(--text-muted)' }} />

          {/* Center crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-muted)' }} />
              <line x1="20" y1="4" x2="20" y2="14" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-muted)' }} />
              <line x1="20" y1="26" x2="20" y2="36" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-muted)' }} />
              <line x1="4" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-muted)' }} />
              <line x1="26" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-muted)' }} />
            </svg>
          </div>

          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative z-10 py-12">
            {/* Camera/lens icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300"
                 style={{
                   background: isDragging ? 'var(--accent-primary)' : 'var(--surface-default)',
                   boxShadow: isDragging ? '0 0 30px var(--accent-glow)' : 'none'
                 }}>
              <svg className="w-10 h-10 transition-colors duration-300"
                   style={{ color: isDragging ? 'var(--bg-primary)' : 'var(--text-secondary)' }}
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="6" width="20" height="14" rx="2" strokeWidth="1.5" />
                <circle cx="12" cy="13" r="4" strokeWidth="1.5" />
                <circle cx="12" cy="13" r="1.5" strokeWidth="1" />
                <path d="M7 6V5a1 1 0 011-1h8a1 1 0 011 1v1" strokeWidth="1.5" />
                <circle cx="17" cy="9" r="1" fill="currentColor" />
              </svg>
            </div>

            {/* Text content */}
            <div className="text-center">
              <p className="font-display text-2xl tracking-wide mb-2"
                 style={{ color: isDragging ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                {isDragging ? 'DROP TO ANALYZE' : 'DROP YOUR FRAME'}
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                or click anywhere to browse
              </p>

              {/* File type indicator */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
                   style={{ background: 'var(--surface-dim)', border: '1px solid var(--border-dim)' }}>
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  JPG
                </span>
                <span style={{ color: 'var(--border-default)' }}>|</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  PNG
                </span>
                <span style={{ color: 'var(--border-default)' }}>|</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  WEBP
                </span>
                <span style={{ color: 'var(--border-default)' }}>|</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Max 10MB
                </span>
              </div>
            </div>
          </div>

          {/* Recording indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="indicator-dot rec-indicator" style={{ background: 'var(--tech-red)' }} />
            <span className="text-xs font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
              REC
            </span>
          </div>

          {/* Aspect ratio indicator */}
          <div className="absolute bottom-4 left-4">
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              2.39:1
            </span>
          </div>

          {/* Frame counter */}
          <div className="absolute bottom-4 right-4">
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              001
            </span>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="6" width="20" height="14" rx="2" strokeWidth="1.5" />
                <circle cx="12" cy="13" r="4" strokeWidth="1.5" />
                <path d="M7 6V5a1 1 0 011-1h8a1 1 0 011 1v1" strokeWidth="1.5" />
              </svg>
            ),
            title: 'FILM STILLS',
            subtitle: 'Movie screenshots & frames'
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
                <path d="M21 15l-5-5L5 21" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ),
            title: 'PHOTOGRAPHS',
            subtitle: 'Professional photography'
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ),
            title: 'VIDEO FRAMES',
            subtitle: 'Behind the scenes shots'
          }
        ].map((item, index) => (
          <div
            key={index}
            className="group p-5 rounded-lg transition-all duration-200 hover-lift"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-dim)'
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style={{
                  background: 'var(--surface-default)',
                  color: 'var(--text-tertiary)'
                }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader
