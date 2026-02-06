import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../auth/AuthContext'
import type { ReactElement } from 'react'

interface Props {
  children: ReactElement
}

const PublicRoute = ({ children }: Props) => {
  const auth = useContext(AuthContext)

  if (!auth || auth.isLoading) return null

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
