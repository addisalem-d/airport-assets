import type { User, CreateUserPayload, UpdateUserPayload } from '../types/User'
import { mockUsers } from '../data/mockUsers'
import { api } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let local = [...mockUsers]

export const userService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) return [...local]
    const res = await api.get<User[]>('/users')
    return res.data
  },

  async create(payload: CreateUserPayload): Promise<User> {
    if (USE_MOCK) {
      const newUser: User = {
        id: Math.max(...local.map(u => u.id)) + 1,
        ...payload,
        is_active: true,
        avatar_initials: payload.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      local.push(newUser)
      return newUser
    }
    const res = await api.post<User>('/users', payload)
    return res.data
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    if (USE_MOCK) {
      local = local.map(u => u.id === id ? { ...u, ...payload, updated_at: new Date().toISOString() } : u)
      return local.find(u => u.id === id)!
    }
    const res = await api.patch<User>(`/users/${id}`, payload)
    return res.data
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) { local = local.filter(u => u.id !== id); return }
    await api.delete(`/users/${id}`)
  },

  async toggleActive(id: number, is_active: boolean): Promise<User> {
    return userService.update(id, { is_active })
  },
}