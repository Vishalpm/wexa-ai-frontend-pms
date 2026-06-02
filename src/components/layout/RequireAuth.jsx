import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/Spinner'

export default function RequireAuth() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={28} />
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
