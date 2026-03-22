import type { Asset, CreateAssetPayload } from '../types/Asset'
import { mockAssets } from '../data/mockAssets'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = '/api/assets'
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

let local = [...mockAssets]

export const assetService = {
  async getAll(): Promise<Asset[]> {
    if (USE_MOCK) return [...local]
    const res = await fetch(BASE, { headers: headers() })
    return res.json()
  },

  async create(payload: CreateAssetPayload): Promise<Asset> {
    if (USE_MOCK) {
      const asset: Asset = {
        id: Math.max(...local.map(a => a.id)) + 1,
        ...payload,
        notes: payload.notes ?? '',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      local.push(asset)
      return asset
    }
    const res = await fetch(BASE, { method: 'POST', headers: headers(), body: JSON.stringify(payload) })
    return res.json()
  },

  async update(id: number, payload: Partial<CreateAssetPayload>): Promise<Asset> {
    if (USE_MOCK) {
      local = local.map(a => a.id === id ? { ...a, ...payload, updated_at: new Date().toISOString() } : a)
      return local.find(a => a.id === id)!
    }
    const res = await fetch(`${BASE}/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(payload) })
    return res.json()
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) { local = local.filter(a => a.id !== id); return }
    await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: headers() })
  },
}