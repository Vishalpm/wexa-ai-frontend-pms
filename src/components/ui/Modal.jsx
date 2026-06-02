import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className={`relative w-full ${width} bg-[#181c23] border border-[#232832] rounded-2xl shadow-2xl`}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232832]">
          <h2 className="text-base font-semibold text-[#e2e6f0]">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#8891a8] hover:text-[#e2e6f0] hover:bg-white/5 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
