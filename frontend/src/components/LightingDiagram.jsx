function LightingDiagram({ data }) {
  const lighting = data || {
    keyLightAngle: 45,
    keyLightSide: 'right',
    fillLight: true,
    fillLightSide: 'left',
    backLight: true,
    sources: 2,
  }

  const keyAngle = lighting.keyLightAngle || 45
  const isKeyRight = lighting.keyLightSide === 'right'

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-dim)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--tech-cyan)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
              LIGHTING SETUP
            </h3>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              TOP-DOWN VIEW
            </p>
          </div>
        </div>
      </div>

      {/* Diagram */}
      <div className="p-6">
        <div className="relative aspect-square max-w-md mx-auto rounded-xl overflow-hidden"
             style={{ background: 'var(--bg-primary)' }}>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full">
              <defs>
                <pattern id="diagramGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--text-muted)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#diagramGrid)" />
            </svg>
          </div>

          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
            {/* Distance rings */}
            <circle cx="100" cy="200" r="180" fill="none" stroke="var(--border-dim)" strokeWidth="0.5" strokeDasharray="4,4" />
            <circle cx="100" cy="200" r="140" fill="none" stroke="var(--border-dim)" strokeWidth="0.5" strokeDasharray="4,4" />
            <circle cx="100" cy="200" r="100" fill="none" stroke="var(--border-dim)" strokeWidth="0.5" strokeDasharray="4,4" />

            {/* Center line */}
            <line x1="100" y1="0" x2="100" y2="200" stroke="var(--border-dim)" strokeWidth="0.5" strokeDasharray="2,4" />

            {/* Subject */}
            <g>
              <circle cx="100" cy="150" r="22" fill="var(--bg-tertiary)" stroke="var(--border-default)" strokeWidth="1" />
              <circle cx="100" cy="143" r="6" fill="var(--text-tertiary)" />
              <ellipse cx="100" cy="167" rx="12" ry="4" fill="var(--bg-elevated)" />
              {/* Subject label */}
              <text x="100" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="6" fontFamily="monospace">
                SUBJECT
              </text>
            </g>

            {/* Key Light */}
            <g transform={`translate(100, 200) rotate(${isKeyRight ? -keyAngle : keyAngle - 180})`}>
              <g transform="translate(0, -160)">
                {/* Light body */}
                <rect x="-10" y="-14" width="20" height="28" rx="3" fill="var(--accent-primary)" />
                {/* Glow rings */}
                <circle cx="0" cy="0" r="24" fill="var(--accent-primary)" opacity="0.25" />
                <circle cx="0" cy="0" r="32" fill="var(--accent-primary)" opacity="0.1" />
                {/* Icon */}
                <circle cx="0" cy="0" r="4" fill="var(--bg-primary)" />
              </g>
              {/* Light beam */}
              <line x1="0" y1="-130" x2="0" y2="-55" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.4" strokeDasharray="4,4" />
            </g>

            {/* Fill Light */}
            {lighting.fillLight && (
              <g transform={`translate(100, 200) rotate(${isKeyRight ? 35 : -35})`}>
                <g transform="translate(0, -120)">
                  {/* Light body */}
                  <rect x="-8" y="-11" width="16" height="22" rx="2" fill="var(--tech-blue)" opacity="0.9" />
                  {/* Glow */}
                  <circle cx="0" cy="0" r="18" fill="var(--tech-blue)" opacity="0.15" />
                  {/* Icon */}
                  <circle cx="0" cy="0" r="3" fill="var(--bg-primary)" />
                </g>
              </g>
            )}

            {/* Back Light */}
            {lighting.backLight && (
              <g transform="translate(100, 200) rotate(180)">
                <g transform="translate(0, -160)">
                  {/* Light body */}
                  <rect x="-8" y="-11" width="16" height="22" rx="2" fill="var(--tech-cyan)" opacity="0.9" />
                  {/* Glow */}
                  <circle cx="0" cy="0" r="18" fill="var(--tech-cyan)" opacity="0.15" />
                  {/* Icon */}
                  <circle cx="0" cy="0" r="3" fill="var(--bg-primary)" />
                </g>
              </g>
            )}

            {/* Camera */}
            <g transform="translate(100, 200)">
              <rect x="-18" y="-12" width="36" height="24" rx="4" fill="var(--bg-elevated)" stroke="var(--border-default)" strokeWidth="1" />
              <circle cx="0" cy="0" r="10" fill="var(--bg-primary)" stroke="var(--border-default)" strokeWidth="1" />
              <circle cx="0" cy="0" r="6" fill="var(--bg-tertiary)" />
              <circle cx="0" cy="0" r="2" fill="var(--text-muted)" />
              {/* Camera label */}
              <text x="0" y="22" textAnchor="middle" fill="var(--text-muted)" fontSize="6" fontFamily="monospace">
                CAMERA
              </text>
            </g>
          </svg>

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>KEY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: 'var(--tech-blue)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>FILL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: 'var(--tech-cyan)' }} />
                <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>BACK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
            <p className="font-mono text-2xl" style={{ color: 'var(--accent-primary)' }}>
              {keyAngle}°
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              KEY ANGLE
            </p>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
            <p className="font-mono text-2xl" style={{ color: 'var(--text-primary)' }}>
              {lighting.sources || 2}
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              SOURCES
            </p>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
            <p className="font-mono text-2xl" style={{ color: 'var(--tech-blue)' }}>
              {isKeyRight ? 'R' : 'L'}
            </p>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              KEY SIDE
            </p>
          </div>
        </div>

        {/* Setup notes */}
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--surface-dim)' }}>
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-display tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>
                SETUP NOTES
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Key light positioned at {keyAngle}° from camera axis on the {isKeyRight ? 'right' : 'left'} side.
                {lighting.fillLight && ' Fill light opposite to reduce contrast ratio.'}
                {lighting.backLight && ' Back light adds separation from background.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LightingDiagram
