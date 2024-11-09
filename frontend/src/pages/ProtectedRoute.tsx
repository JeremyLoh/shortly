import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth"

function ProtectedRoute() {
  const auth = useAuth()
  if (auth && auth.user) {
    return <Outlet />
  }
  return <Navigate to="/error" replace />
}

export default ProtectedRoute
