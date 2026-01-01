import { useState } from 'react'
import CameraPanel from './CameraPanel'
import LightingPanel from './LightingPanel'
import ColorPanel from './ColorPanel'
import LightingDiagram from './LightingDiagram'

function AnalysisResults({ result, imagePreview }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'lighting', label: 'Lighting Diagram' },
    { id: 'color', label: 'Color Analysis' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <img
              src={imagePreview}
              alt="Analyzed"
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Quick Summary</h4>
              <p className="text-white text-sm">
                {result.summary || 'Professional shot with controlled lighting and cinematic color grade.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-4">
              <CameraPanel data={result.camera} />
              <LightingPanel data={result.lighting} />
              <div className="md:col-span-2">
                <ColorPanel data={result.color} />
              </div>
            </div>
          )}

          {activeTab === 'lighting' && (
            <LightingDiagram data={result.lighting} />
          )}

          {activeTab === 'color' && (
            <div className="space-y-6">
              <ColorPanel data={result.color} expanded />
              {result.color?.palette && (
                <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Color Palette</h3>
                  <div className="flex gap-2 h-20 rounded-lg overflow-hidden">
                    {result.color.palette.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 relative group cursor-pointer"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <span className="text-xs font-mono text-white">{color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl border border-amber-500/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>Recreation Guide</span>
              <span className="px-2 py-0.5 text-xs bg-amber-500/30 text-amber-300 rounded-full">AI Generated</span>
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              {result.recreationGuide?.map((step, index) => (
                <div key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-xs text-amber-300">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              )) || (
                <>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-xs text-amber-300">1</span>
                    <p>Use a {result.camera?.focalLength || '50-85mm'} lens at {result.camera?.aperture || 'f/2.0-2.8'} for similar depth of field</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-xs text-amber-300">2</span>
                    <p>Position your key light at {result.lighting?.keyLightAngle || '45°'} from camera {result.lighting?.keyLightSide || 'right'}</p>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center text-xs text-amber-300">3</span>
                    <p>Apply a {result.color?.temperature || 'warm'} color grade with {result.color?.contrast || 'medium'} contrast</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults
