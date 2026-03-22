export interface Location {
  id: number
  name: string
  code: string
  type: string
  building: string | null
  floor: string | null
  description: string
  is_active: boolean
  asset_count?: number
  created_at: string
  updated_at: string
}

export interface CreateLocationPayload {
  name: string
  code: string
  type: string
  building?: string
  floor?: string
  description?: string
}

export const LOCATION_TYPES = [
  'terminal', 'gate', 'runway', 'apron', 'hangar',
  'cargo', 'maintenance_bay', 'parking', 'fuel_depot',
  'control_tower', 'office',
] as const