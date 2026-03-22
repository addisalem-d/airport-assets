import type { Location, CreateLocationPayload } from '../types/Location'
import { mockLocations } from '../data/mockLocations'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = '/api/locations'
const token = () => localStorage.getItem('token')
const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` })

let local = [...mockLocations]

export const locationService = {
  async getAll(): Promise<Location[]> {
    if (USE_MOCK) return [...local]
    const res = await fetch(BASE, { headers: headers() })
    return res.json()
  },

  async create(payload: CreateLocationPayload): Promise<Location> {
    if (USE_MOCK) {
      const loc: Location = {
        id: Math.max(...local.map(l => l.id)) + 1,
        building: null, floor: null, description: '',
        ...payload,
        is_active: true, asset_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      local.push(loc)
      return loc
    }
    const res = await fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
    return res.json()
  },
}