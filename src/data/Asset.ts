export type AssetStatus   = 'active' | 'inactive' | 'maintenance' | 'retired'
export type AssetCategory = 'ground_support' | 'passenger_services' | 'baggage_handling' | 'fueling' | 'aircraft_maintenance' | 'security' | 'facilities' | 'vehicles'

export interface Asset {
  id: number
  name: string
  serial_number: string
  category: AssetCategory
  status: AssetStatus
  location_id: number
  location_name?: string
  purchase_date: string
  purchase_price: number
  notes: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateAssetPayload {
  name: string
  serial_number: string
  category: AssetCategory
  status: AssetStatus
  location_id: number
  purchase_date: string
  purchase_price: number
  notes?: string
}

export const ASSET_CATEGORIES: AssetCategory[] = [
  'ground_support', 'passenger_services', 'baggage_handling',
  'fueling', 'aircraft_maintenance', 'security', 'facilities', 'vehicles',
]

export const ASSET_STATUSES: AssetStatus[] = ['active', 'inactive', 'maintenance', 'retired']

export const CATEGORY_LABEL: Record<AssetCategory, string> = {
  ground_support:       'Ground Support',
  passenger_services:   'Passenger Services',
  baggage_handling:     'Baggage Handling',
  fueling:              'Fueling',
  aircraft_maintenance: 'Aircraft Maint.',
  security:             'Security',
  facilities:           'Facilities',
  vehicles:             'Vehicles',
}

export const STATUS_COLORS: Record<AssetStatus, string> = {
  active:      '#22c48a',
  inactive:    '#bbb',
  maintenance: '#f5a623',
  retired:     '#f05252',
}