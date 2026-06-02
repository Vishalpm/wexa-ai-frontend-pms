export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
          <Icon size={24} className="text-[#3d4455]" />
        </div>
      )}
      <h3 className="text-sm font-medium text-[#e2e6f0] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#8891a8] max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
