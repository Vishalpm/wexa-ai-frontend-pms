const variants = {
  green:  'bg-green-500/10 text-green-400 ring-green-500/20',
  red:    'bg-red-500/10 text-red-400 ring-red-500/20',
  amber:  'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  blue:   'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  gray:   'bg-white/5 text-[#8891a8] ring-white/10',
}

export default function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
