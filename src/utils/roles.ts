import type { Role } from '../auth/AuthContext'

export const canViewTasks = (role: Role) => {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MEMBER'
}

export const canManageUsers = (role: Role) => {
  return role === 'OWNER' || role === 'ADMIN'
}

export const isOwner = (role: Role) => role === 'OWNER'
