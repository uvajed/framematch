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
    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-6">Lighting Setup Diagram</h3>

      <div className="relative aspect-square max-w-md mx-auto bg-slate-900 rounded-xl overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="200" r="180" fill="none" stroke="#374151" strokeWidth="0.5" strokeDasharray="4,4" />
          <circle cx="100" cy="200" r="140" fill="none" stroke="#374151" strokeWidth="0.5" strokeDasharray="4,4" />
          <circle cx="100" cy="200" r="100" fill="none" stroke="#374151" strokeWidth="0.5" strokeDasharray="4,4" />

          <circle cx="100" cy="150" r="20" fill="#4b5563" />
          <circle cx="100" cy="143" r="5" fill="#9ca3af" />
          <ellipse cx="100" cy="165" rx="10" ry="3" fill="#374151" />

          <g transform={`translate(100, 200) rotate(${isKeyRight ? -keyAngle : keyAngle - 180})`}>
            <g transform="translate(0, -160)">
              <rect x="-8" y="-12" width="16" height="24" rx="2" fill="#fbbf24" className="animate-pulse" />
              <circle cx="0" cy="0" r="20" fill="#fbbf24" opacity="0.3" />
              <circle cx="0" cy="0" r="30" fill="#fbbf24" opacity="0.1" />
            </g>
            <line x1="0" y1="-130" x2="0" y2="-60" stroke="#fbbf24" strokeWidth="1" opacity="0.5" strokeDasharray="4,4" />
          </g>

          {lighting.fillLight && (
            <g transform={`translate(100, 200) rotate(${isKeyRight ? 30 : -30})`}>
              <g transform="translate(0, -120)">
                <rect x="-6" y="-9" width="12" height="18" rx="2" fill="#60a5fa" opacity="0.8" />
                <circle cx="0" cy="0" r="15" fill="#60a5fa" opacity="0.2" />
              </g>
            </g>
          )}

          {lighting.backLight && (
            <g transform="translate(100, 200) rotate(180)">
              <g transform="translate(0, -160)">
                <rect x="-6" y="-9" width="12" height="18" rx="2" fill="#2dd4bf" opacity="0.8" />
                <circle cx="0" cy="0" r="15" fill="#2dd4bf" opacity="0.2" />
              </g>
            </g>
          )}

          <g transform="translate(100, 200)">
            <rect x="-15" y="-10" width="30" height="20" rx="3" fill="#475569" />
            <circle cx="0" cy="0" r="8" fill="#1e293b" />
            <circle cx="0" cy="0" r="5" fill="#334155" />
          </g>
        </svg>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="text-slate-400">Key Light</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            <span className="text-slate-400">Fill Light</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-400"></span>
            <span className="text-slate-400">Back Light</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-slate-900 rounded-lg">
          <p className="text-2xl font-bold text-yellow-400">{keyAngle}°</p>
          <p className="text-xs text-slate-500 mt-1">Key Light Angle</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-lg">
          <p className="text-2xl font-bold text-white">{lighting.sources || 2}</p>
          <p className="text-xs text-slate-500 mt-1">Light Sources</p>
        </div>
        <div className="p-3 bg-slate-900 rounded-lg">
          <p className="text-2xl font-bold text-blue-400">{isKeyRight ? 'Right' : 'Left'}</p>
          <p className="text-xs text-slate-500 mt-1">Key Side</p>
        </div>
      </div>
    </div>
  )
}

export default LightingDiagram
