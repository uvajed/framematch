function LightingPanel({ data }) {
  const lighting = data || {
    keyLightAngle: '45°',
    keyLightSide: 'right',
    quality: 'Soft',
    ratio: '3:1',
    sources: '2',
    pattern: 'Rembrandt',
    temperature: 'Warm (3200K)',
  }

  const items = [
    { label: 'Key Light', value: `${lighting.keyLightAngle} ${lighting.keyLightSide}`, code: 'KEY' },
    { label: 'Light Quality', value: lighting.quality, code: 'QUAL' },
    { label: 'Lighting Ratio', value: lighting.ratio, code: 'RATIO' },
    { label: 'Sources', value: lighting.sources, code: 'SRC' },
    { label: 'Pattern', value: lighting.pattern, code: 'PTRN' },
    { label: 'Color Temp', value: lighting.temperature, code: 'K' },
  ]

  return (
    <div className="h-full rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-dim)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(245, 166, 35, 0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
              LIGHTING ANALYSIS
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="indicator-dot" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-glow)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-3 rounded-lg transition-colors duration-150"
              style={{ background: index % 2 === 0 ? 'var(--surface-dim)' : 'transparent' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs w-12 text-center py-1 rounded"
                      style={{ background: 'var(--surface-default)', color: 'var(--text-muted)' }}>
                  {item.code}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {item.label}
                </span>
              </div>
              <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LightingPanel
