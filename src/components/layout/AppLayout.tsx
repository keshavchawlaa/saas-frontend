import { Outlet, Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../auth/AuthContext'
import { canViewTasks, canManageUsers } from '../../utils/roles'
// import { useAuth } from '../../auth/useAuth'


const AppLayout = () => {
  const auth = useContext(AuthContext)
  const location = useLocation()
  if (!auth) return null

  const isActive = (path: string) =>
    location.pathname === path ?  'active' : ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
  <div className="sidebar-header">
    <h3>Falcon</h3>
  </div>

  <nav className="sidebar-nav">
    <Link to="/dashboard" className={isActive('/dashboard')}>
      Dashboard
    </Link>

    {auth.user && canViewTasks(auth.user.role) && (
      <Link to="/tasks" className={isActive('/tasks')}>
        My Tasks
      </Link>
    )}

    {auth.user && canManageUsers(auth.user.role) && (
      <Link to="/users" className={isActive('/users')}>
        Users
      </Link>
    )}

    {(auth.user?.role === 'ADMIN' || auth.user?.role === 'OWNER') && (
      <Link to="/activity" className={isActive('/activity')}>
        Activity Logs
      </Link>
    )}
  </nav>

  <div className="sidebar-footer">
    <div className="sidebar-role">
      Role: <strong>{auth.user?.role}</strong>
    </div>
    <button className="danger" onClick={auth.logout}>
      Logout
    </button>
  </div>
</aside>


      {/* Main content */}
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
