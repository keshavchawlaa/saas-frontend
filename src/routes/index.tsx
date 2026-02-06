import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Tasks from '../pages/Tasks'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'
import AppLayout from '../components/layout/AppLayout'
import Users from '../pages/Users'
import ActivityLogs from '../pages/ActivityLogs'


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />


        {/* Protected layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
           {/* ADMIN / OWNER only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
        <Route
  path="/activity"
  element={
    <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
      <ActivityLogs />
    </ProtectedRoute>
  }
/>
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
