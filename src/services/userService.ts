import type { User, CreateUserPayload, UpdateUserPayload } from '../types/User'
import { mockUsers } from '../data/mockUsers'
import { api } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE     = '/users/'


// ── simulate network delay for mock ──────────────────────────────────────────
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

let localUsers = [...mockUsers]

export const userService = {

  async getAll(): Promise<User[]> {
    if (USE_MOCK) { await delay(); return [...localUsers] }
    return api.get<User[]>(BASE).then(res => res.data)
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
    return api.post<User>(BASE, payload).then(res => res.data)
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    if (USE_MOCK) {
      await delay()
      localUsers = localUsers.map(u =>
        u.id === id ? { ...u, ...payload, updated_at: new Date().toISOString() } : u
      )
      return localUsers.find(u => u.id === id)!
    }
    return api.patch<User>(`${BASE}${id}`, payload).then(res => res.data)
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) { await delay(); localUsers = localUsers.filter(u => u.id !== id); return }
    await api.delete(`${BASE}${id}`)
  },

  async toggleActive(id: number, is_active: boolean): Promise<User> {
    return userService.update(id, { is_active })
  },
}