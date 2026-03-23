import type { Location, CreateLocationPayload } from '../types/Location'
import { mockLocations } from '../data/mockLocations'
import { api } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let local = [...mockLocations]

export const locationService = {
  async getAll(): Promise<Location[]> {
    if (USE_MOCK) return [...local]
    const res = await api.get<Location[]>('/locations')
    return res.data
  },

  async create(payload: CreateLocationPayload): Promise<Location> {
    if (USE_MOCK) {
      const loc: Location = {
        id: Math.max(...local.map(l => l.id)) + 1,
        building: null,
        floor: null,
        description: '',
        ...payload,
        is_active: true,
        asset_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      local.push(loc)
      return loc
    }
    const res = await api.post<Location>('/locations', payload)
    return res.data
  },
}