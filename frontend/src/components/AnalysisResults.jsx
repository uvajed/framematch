import { useState } from 'react'
import CameraPanel from './CameraPanel'
import LightingPanel from './LightingPanel'
import ColorPanel from './ColorPanel'
import LightingDiagram from './LightingDiagram'

function AnalysisResults({ result, imagePreview }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { id: 'lighting', label: 'LIGHTING', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )},
    { id: 'color', label: 'COLOR', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )},
  ]

  return (
    <div className="animate-fade-in-up">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Image & Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Image with monitor frame */}
            <div className="monitor-frame">
              <div className="monitor-screen">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Analyzed"
                    className="w-full"
                  />
                  {/* Viewfinder corners */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2"
                       style={{ borderColor: 'var(--accent-primary)' }} />
                  <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2"
                       style={{ borderColor: 'var(--accent-primary)' }} />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2"
                       style={{ borderColor: 'var(--accent-primary)' }} />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2"
                       style={{ borderColor: 'var(--accent-primary)' }} />

                  {/* Frame info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3"
                       style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.8), transparent)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        FRAME 001
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--accent-primary)' }}>
                        ANALYZED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick summary card */}
            <div className="p-5 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  QUICK SUMMARY
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {result.summary || 'Professional shot with controlled lighting and cinematic color grade.'}
              </p>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
                <p className="font-mono text-lg" style={{ color: 'var(--accent-primary)' }}>
                  {result.camera?.focalLength || '~85mm'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Focal Length
                </p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
                <p className="font-mono text-lg" style={{ color: 'var(--accent-primary)' }}>
                  {result.camera?.aperture || 'f/2.0'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Aperture
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Analysis panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab navigation */}
          <div className="flex gap-2 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-display tracking-wide rounded-md transition-all duration-200"
                style={{
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-tertiary)',
                }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <div className="space-y-4 stagger-children">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="animate-fade-in-up" style={{ opacity: 0 }}>
                  <CameraPanel data={result.camera} />
                </div>
                <div className="animate-fade-in-up" style={{ opacity: 0 }}>
                  <LightingPanel data={result.lighting} />
                </div>
              </div>
              <div className="animate-fade-in-up" style={{ opacity: 0 }}>
                <ColorPanel data={result.color} />
              </div>
            </div>
          )}

          {activeTab === 'lighting' && (
            <div className="animate-fade-in-up">
              <LightingDiagram data={result.lighting} />
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-4 animate-fade-in-up">
              <ColorPanel data={result.color} expanded />
              {result.color?.palette && (
                <div className="p-6 rounded-lg" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-dim)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-display text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
                      EXTRACTED PALETTE
                    </span>
                  </div>
                  <div className="flex gap-2 h-16 rounded-lg overflow-hidden">
                    {result.color.palette.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1 relative group cursor-pointer transition-transform duration-200 hover:scale-105"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity"
                             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                          <span className="font-mono text-xs" style={{ color: 'var(--text-primary)' }}>{color}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recreation Guide */}
          <div className="p-6 rounded-lg" style={{ background: 'rgba(245, 166, 35, 0.05)', border: '1px solid rgba(245, 166, 35, 0.2)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{ background: 'var(--accent-primary)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--bg-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg tracking-wide" style={{ color: 'var(--text-primary)' }}>
                  RECREATION GUIDE
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ background: 'rgba(245, 166, 35, 0.2)', color: 'var(--accent-primary)' }}>
                  AI GENERATED
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {result.recreationGuide?.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm"
                       style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent-primary)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                </div>
              )) || (
                <>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm"
                         style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent-primary)' }}>01</div>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>
                      Use a {result.camera?.focalLength || '50-85mm'} lens at {result.camera?.aperture || 'f/2.0-2.8'} for similar depth of field
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm"
                         style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent-primary)' }}>02</div>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>
                      Position your key light at {result.lighting?.keyLightAngle || '45°'} from camera {result.lighting?.keyLightSide || 'right'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm"
                         style={{ background: 'rgba(245, 166, 35, 0.15)', color: 'var(--accent-primary)' }}>03</div>
                    <p className="text-sm leading-relaxed pt-1" style={{ color: 'var(--text-secondary)' }}>
                      Apply a {result.color?.temperature || 'warm'} color grade with {result.color?.contrast || 'medium'} contrast
                    </p>
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
