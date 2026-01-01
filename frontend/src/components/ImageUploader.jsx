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
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-white">
              Drop your image here
            </p>
            <p className="text-sm text-slate-400 mt-1">
              or click to browse
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-sm font-medium text-white">Film Stills</p>
          <p className="text-xs text-slate-400 mt-1">Movie screenshots</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl mb-2">🎨</div>
          <p className="text-sm font-medium text-white">Photographs</p>
          <p className="text-xs text-slate-400 mt-1">Professional shots</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="text-2xl mb-2">🎬</div>
          <p className="text-sm font-medium text-white">BTS Photos</p>
          <p className="text-xs text-slate-400 mt-1">Behind the scenes</p>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader
