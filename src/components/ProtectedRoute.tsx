import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import type { Role } from '../auth/AuthContext'
import type { ReactElement } from 'react'

interface Props {
  children: ReactElement
  allowedRoles?: Role[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const auth = useContext(AuthContext)

  if (!auth || auth.isLoading) return null

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  } 

  if (allowedRoles && !allowedRoles.includes(auth.user!.role)) {
    return <div>403 — Access denied</div>
  }

  return children
}

export default ProtectedRoute
