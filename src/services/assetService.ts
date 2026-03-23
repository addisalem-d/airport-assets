import type { Asset, CreateAssetPayload } from '../types/Asset'
import { mockAssets } from '../data/mockAssets'
import { api } from './api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let local = [...mockAssets]

export const assetService = {
  async getAll(): Promise<Asset[]> {
    if (USE_MOCK) return [...local]
    const res = await api.get<Asset[]>('/assets')
    return res.data
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
    const res = await api.post<Asset>('/assets', payload)
    return res.data
  },

  async update(id: number, payload: Partial<CreateAssetPayload>): Promise<Asset> {
    if (USE_MOCK) {
      local = local.map(a => a.id === id ? { ...a, ...payload, updated_at: new Date().toISOString() } : a)
      return local.find(a => a.id === id)!
    }
    const res = await api.patch<Asset>(`/assets/${id}`, payload)
    return res.data
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) { local = local.filter(a => a.id !== id); return }
    await api.delete(`/assets/${id}`)
  },
}