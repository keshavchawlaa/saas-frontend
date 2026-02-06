import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

const Dashboard = () => {
  const auth = useContext(AuthContext)

  if (!auth) return null

  return (
    <>
      <h1>Dashboard</h1>
      <p>User ID: {auth.user?.userId}</p>
      <p>Org ID: {auth.user?.orgId}</p>
    </>
  )
}

export default Dashboard
