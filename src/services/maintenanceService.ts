import type { MaintenanceLog, CreateMaintenancePayload } from '../types/Maintenance'
import { mockMaintenance } from '../data/mockMaintenance'
import { api } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let local = [...mockMaintenance]

export const maintenanceService = {
  async getAll(): Promise<MaintenanceLog[]> {
    if (USE_MOCK) return [...local]
    const res = await api.get<MaintenanceLog[]>('/maintenance')
    return res.data
  },

  async create(payload: CreateMaintenancePayload): Promise<MaintenanceLog> {
    if (USE_MOCK) {
      const log: MaintenanceLog = {
        id: Math.max(...local.map(m => m.id)) + 1,
        ...payload,
        notes: payload.notes ?? '',
        status: 'scheduled',
        completed_at: null,
        cost: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      local.push(log)
      return log
    }
    const res = await api.post<MaintenanceLog>('/maintenance', payload)
    return res.data
  },

  async updateStatus(id: number, status: string): Promise<MaintenanceLog> {
    if (USE_MOCK) {
      local = local.map(m => m.id === id ? { ...m, status: status as MaintenanceLog['status'] } : m)
      return local.find(m => m.id === id)!
    }
    const res = await api.patch<MaintenanceLog>(`/maintenance/${id}`, { status })
    return res.data
  },
}