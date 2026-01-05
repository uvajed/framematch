function ColorPanel({ data, expanded = false }) {
  const color = data || {
    temperature: 'Warm',
    contrast: 'Medium-High',
    saturation: 'Slightly Desaturated',
    shadows: 'Lifted, Teal tint',
    highlights: 'Warm, Orange push',
    palette: ['#1a2634', '#3d4f5f', '#d4a574', '#f5e6d3', '#8b5a2b'],
  }

  const items = [
    { label: 'Temperature', value: color.temperature, code: 'TEMP' },
    { label: 'Contrast', value: color.contrast, code: 'CNTR' },
    { label: 'Saturation', value: color.saturation, code: 'SAT' },
    { label: 'Shadows', value: color.shadows, code: 'SHDW' },
    { label: 'Highlights', value: color.highlights, code: 'HIGH' },
  ]

  const downloadLUT = () => {
    const size = 17
    const toneCurve = color.toneCurve || [[0, 0], [50, 50], [100, 100]]

    const applyToneCurve = (value) => {
      const v = value * 100
      for (let i = 0; i < toneCurve.length - 1; i++) {
        const [x1, y1] = toneCurve[i]
        const [x2, y2] = toneCurve[i + 1]
        if (v >= x1 && v <= x2) {
          const t = (v - x1) / (x2 - x1)
          return (y1 + t * (y2 - y1)) / 100
        }
      }
      return value
    }

    const isWarm = color.temperature?.toLowerCase().includes('warm')
    const isCool = color.temperature?.toLowerCase().includes('cool')
    const hasTealShadows = color.shadows?.toLowerCase().includes('teal')
    const hasWarmHighlights = color.highlights?.toLowerCase().includes('warm')

    let lutContent = `TITLE "FrameMatch - Generated LUT"\n`
    lutContent += `# Generated from image analysis\n`
    lutContent += `LUT_3D_SIZE ${size}\n\n`

    for (let b = 0; b < size; b++) {
      for (let g = 0; g < size; g++) {
        for (let r = 0; r < size; r++) {
          let rVal = r / (size - 1)
          let gVal = g / (size - 1)
          let bVal = b / (size - 1)

          const luminance = 0.299 * rVal + 0.587 * gVal + 0.114 * bVal
          const curveMultiplier = applyToneCurve(luminance) / (luminance || 0.001)

          rVal = Math.min(1, rVal * curveMultiplier)
          gVal = Math.min(1, gVal * curveMultiplier)
          bVal = Math.min(1, bVal * curveMultiplier)

          if (isWarm) {
            rVal = Math.min(1, rVal * 1.05)
            bVal = bVal * 0.95
          } else if (isCool) {
            rVal = rVal * 0.95
            bVal = Math.min(1, bVal * 1.05)
          }

          if (hasTealShadows && luminance < 0.4) {
            const shadowAmount = (0.4 - luminance) / 0.4
            gVal = Math.min(1, gVal + shadowAmount * 0.03)
            bVal = Math.min(1, bVal + shadowAmount * 0.05)
          }

          if (hasWarmHighlights && luminance > 0.6) {
            const highlightAmount = (luminance - 0.6) / 0.4
            rVal = Math.min(1, rVal + highlightAmount * 0.03)
          }

          lutContent += `${rVal.toFixed(6)} ${gVal.toFixed(6)} ${bVal.toFixed(6)}\n`
        }
      }
    }

    const blob = new Blob([lutContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'framematch-grade.cube'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateCurvePath = (points) => {
    if (!points || points.length < 2) {
      return "M 0 100 L 100 0"
    }

    const svgPoints = points.map(([x, y]) => [x, 100 - y])
    let path = `M ${svgPoints[0][0]} ${svgPoints[0][1]}`

    for (let i = 1; i < svgPoints.length; i++) {
      const prev = svgPoints[i - 1]
      const curr = svgPoints[i]
      const cpX = (prev[0] + curr[0]) / 2
      const cpY = prev[1]

      if (i === 1) {
        path += ` Q ${cpX} ${cpY}, ${curr[0]} ${curr[1]}`
      } else {
        path += ` T ${curr[0]} ${curr[1]}`
      }
    }

    return path
  }

  const curvePath = generateCurvePath(color.toneCurve)
  const fillPath = curvePath + " L 100 100 L 0 100 Z"

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-dim)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--tech-magenta)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
              COLOR GRADE
            </h3>
          </div>
        </div>
        <button
          onClick={downloadLUT}
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono rounded-lg transition-all duration-200"
          style={{
            background: 'var(--surface-default)',
            border: '1px solid var(--border-default)',
            color: 'var(--accent-primary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245, 166, 35, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(245, 166, 35, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-default)'
            e.currentTarget.style.borderColor = 'var(--border-default)'
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>.CUBE</span>
        </button>
      </div>

      {/* Palette strip */}
      {!expanded && color.palette && (
        <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border-dim)' }}>
          <div className="flex gap-1 h-6 rounded overflow-hidden">
            {color.palette.map((c, i) => (
              <div key={i} className="flex-1 transition-transform duration-200 hover:scale-y-125" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className={`grid ${expanded ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-x-4 gap-y-1`}>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-3 rounded-lg transition-colors duration-150"
              style={{ background: expanded ? (index % 2 === 0 ? 'var(--surface-dim)' : 'transparent') : 'transparent' }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs w-10 text-center py-1 rounded"
                      style={{ background: 'var(--surface-default)', color: 'var(--text-muted)' }}>
                  {item.code}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {item.label}
                </span>
              </div>
              <span className="font-mono text-sm text-right" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tone Curve - only in expanded mode */}
      {expanded && (
        <div className="px-5 pb-5">
          <div className="pt-4" style={{ borderTop: '1px solid var(--border-dim)' }}>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span className="font-display text-xs tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                TONE CURVE
              </span>
            </div>

            <div className="relative h-48 rounded-lg overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
              {/* Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid" width="25%" height="25%" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--border-default)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Curve */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                {/* Reference diagonal */}
                <line x1="0" y1="100" x2="100" y2="0" stroke="var(--border-default)" strokeWidth="0.5" strokeDasharray="2,2" />
                {/* Curve fill */}
                <path d={fillPath} fill="url(#curveGrad)" />
                {/* Curve line */}
                <path d={curvePath} fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
                {/* Control points */}
                {color.toneCurve?.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={100 - y} r="3" fill="var(--accent-primary)" />
                ))}
              </svg>

              {/* Labels */}
              <div className="absolute bottom-2 left-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                SHADOWS
              </div>
              <div className="absolute top-2 right-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                HIGHLIGHTS
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPanel
