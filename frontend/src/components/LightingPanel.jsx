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
    { label: 'Key Light', value: `${lighting.keyLightAngle} ${lighting.keyLightSide}`, icon: '💡' },
    { label: 'Light Quality', value: lighting.quality, icon: '✨' },
    { label: 'Lighting Ratio', value: lighting.ratio, icon: '⚖️' },
    { label: 'Sources', value: lighting.sources, icon: '🔦' },
    { label: 'Pattern', value: lighting.pattern, icon: '🎭' },
    { label: 'Color Temp', value: lighting.temperature, icon: '🌡️' },
  ]

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white">Lighting Analysis</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <span>{item.icon}</span>
              {item.label}
            </span>
            <span className="text-sm font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LightingPanel
