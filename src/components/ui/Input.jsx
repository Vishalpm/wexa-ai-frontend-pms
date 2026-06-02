export default function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#8891a8] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 rounded-lg bg-[#0d0f12] border text-sm text-[#e2e6f0] placeholder-[#3d4455]
          outline-none transition-all
          ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' : 'border-[#232832] focus:border-[#f59e0b] focus:ring-2 focus:ring-amber-500/10'}
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {hint && !error && <span className="text-xs text-[#8891a8]">{hint}</span>}
    </div>
  )
}
