import { createContext } from 'react'

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER'

export interface AuthUser {
  userId: string
  orgId: string
  role: Role
}

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

// import { createContext } from 'react'

// export type Role = 'OWNER' | 'ADMIN' | 'MEMBER'

// export interface AuthUser {
//   userId: string
//   orgId: string
//   role: Role
// }

// export interface AuthContextType {
//   user: AuthUser | null
//   token: string | null
//   isAuthenticated: boolean
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<void>
//   logout: () => void
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined)
