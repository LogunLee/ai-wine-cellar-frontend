import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../entities/auth/store'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
