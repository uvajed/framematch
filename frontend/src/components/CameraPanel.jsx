function CameraPanel({ data }) {
  const camera = data || {
    focalLength: '~85mm',
    aperture: 'f/2.0 - f/2.8',
    iso: 'Low (100-400)',
    shutterSpeed: '1/125s',
    sensorSize: 'Full Frame',
  }

  const items = [
    { label: 'Focal Length', value: camera.focalLength, code: 'FL' },
    { label: 'Aperture', value: camera.aperture, code: 'f/' },
    { label: 'ISO', value: camera.iso, code: 'ISO' },
    { label: 'Shutter Speed', value: camera.shutterSpeed, code: 'SS' },
    { label: 'Sensor Size', value: camera.sensorSize, code: 'SNSR' },
  ]

  if (camera.camera) {
    items.unshift({ label: 'Camera', value: camera.camera, code: 'CAM' })
  }
  if (camera.lens) {
    items.splice(camera.camera ? 1 : 0, 0, { label: 'Lens', value: camera.lens, code: 'LENS' })
  }

  return (
    <div className="h-full rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-dim)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--tech-blue)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="6" width="20" height="14" rx="2" strokeWidth="1.5" />
              <circle cx="12" cy="13" r="4" strokeWidth="1.5" />
              <circle cx="12" cy="13" r="1.5" strokeWidth="1" />
              <path d="M7 6V5a1 1 0 011-1h8a1 1 0 011 1v1" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
              CAMERA SETTINGS
            </h3>
          </div>
        </div>
        {camera.hasExif ? (
          <span className="text-xs font-mono px-2 py-1 rounded"
                style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--tech-green)' }}>
            EXIF
          </span>
        ) : (
          <span className="text-xs font-mono px-2 py-1 rounded"
                style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent-primary)' }}>
            EST
          </span>
        )}
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
                <span className="font-mono text-xs w-10 text-center py-1 rounded"
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

export default CameraPanel
