export type UserRole = 'administrator' | 'manager'

export interface User {
  id: number
  name: string
  username: string
  email: string
  role: UserRole
  is_active: boolean
  avatar_initials: string
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  name: string
  username: string
  email: string
  role: UserRole
  password: string
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: UserRole
  is_active?: boolean
}