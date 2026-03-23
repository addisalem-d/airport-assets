import type { MaintenanceLog, CreateMaintenancePayload } from '../types/Maintenance'
import { mockMaintenance } from '../data/mockMaintenance'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = '/api/maintenance'
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` })

let local = [...mockMaintenance]

export const maintenanceService = {
  async getAll(): Promise<MaintenanceLog[]> {
    if (USE_MOCK) return [...local]
    const res = await fetch(BASE, { headers: headers() })
    return res.json()
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
    const res = await fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
    return res.json()
  },

  async updateStatus(id: number, status: string): Promise<MaintenanceLog> {
    if (USE_MOCK) {
      local = local.map(m => m.id === id ? { ...m, status: status as MaintenanceLog['status'], updated_at: new Date().toISOString() } : m)
      return local.find(m => m.id === id)!
    }
    const res = await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status }) })
    return res.json()
  },
}