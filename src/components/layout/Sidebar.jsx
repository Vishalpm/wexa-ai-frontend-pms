import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Settings, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',  icon: Package,         label: 'Products' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col h-full bg-[#13161b] border-r border-[#232832]">

      {/* logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[#232832]">
        <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
          <Zap size={14} className="text-black fill-black" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-[#e2e6f0]">StockFlow</span>
      </div>

      {/* org pill */}
      <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-xl bg-[#181c23] border border-[#232832]">
        <p className="text-xs text-[#8891a8] mb-0.5">Organization</p>
        <p className="text-sm font-medium text-[#e2e6f0] truncate">{user?.organizationName}</p>
      </div>

      {/* nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
              ${isActive
                ? 'bg-amber-400/10 text-amber-400 font-medium'
                : 'text-[#8891a8] hover:bg-white/5 hover:text-[#e2e6f0]'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* bottom user + logout */}
      <div className="border-t border-[#232832] p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-amber-400/20 flex items-center justify-center text-xs font-semibold text-amber-400 shrink-0">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-[#8891a8] truncate flex-1">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8891a8] hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
