import type { User, CreateUserPayload, UpdateUserPayload } from '../types/User'
import { mockUsers } from '../data/mockUsers'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE     = '/api/users'

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    ...options,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ── simulate network delay for mock ──────────────────────────────────────────
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

let localUsers = [...mockUsers]

export const userService = {

  async getAll(): Promise<User[]> {
    if (USE_MOCK) { await delay(); return [...localUsers] }
    return request<User[]>(BASE)
  },

  async create(payload: CreateUserPayload): Promise<User> {
    if (USE_MOCK) {
      await delay()
      const newUser: User = {
        id: Math.max(...localUsers.map(u => u.id)) + 1,
        ...payload,
        is_active: true,
        avatar_initials: payload.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localUsers.push(newUser)
      return newUser
    }
    return request<User>(BASE, { method: 'POST', body: JSON.stringify(payload) })
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    if (USE_MOCK) {
      await delay()
      localUsers = localUsers.map(u =>
        u.id === id ? { ...u, ...payload, updated_at: new Date().toISOString() } : u
      )
      return localUsers.find(u => u.id === id)!
    }
    return request<User>(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) { await delay(); localUsers = localUsers.filter(u => u.id !== id); return }
    return request<void>(`${BASE}/${id}`, { method: 'DELETE' })
  },

  async toggleActive(id: number, is_active: boolean): Promise<User> {
    return userService.update(id, { is_active })
  },
}