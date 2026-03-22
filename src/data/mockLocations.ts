import type { Location } from '../types/Location'

export const mockLocations: Location[] = [
  { id: 1, name: 'Terminal A',    code: 'TERM-A',  type: 'terminal',   building: 'Main',  floor: '1',      description: 'Main passenger terminal',     is_active: true,  asset_count: 34, created_at: '', updated_at: '' },
  { id: 2, name: 'Terminal B',    code: 'TERM-B',  type: 'terminal',   building: 'Main',  floor: '1',      description: 'International terminal',      is_active: true,  asset_count: 28, created_at: '', updated_at: '' },
  { id: 3, name: 'Gate 12',       code: 'G-12',    type: 'gate',       building: 'Main',  floor: '2',      description: 'Domestic departure gate',     is_active: true,  asset_count: 8,  created_at: '', updated_at: '' },
  { id: 4, name: 'Hangar 3',      code: 'HGR-3',   type: 'hangar',     building: null,    floor: null,     description: 'Aircraft maintenance hangar', is_active: true,  asset_count: 19, created_at: '', updated_at: '' },
  { id: 5, name: 'Cargo Bay 1',   code: 'CRG-1',   type: 'cargo',      building: 'Cargo', floor: 'Ground', description: 'Main cargo handling area',    is_active: true,  asset_count: 22, created_at: '', updated_at: '' },
  { id: 6, name: 'Fuel Depot N',  code: 'FUEL-N',  type: 'fuel_depot', building: null,    floor: null,     description: 'North fuel storage',          is_active: true,  asset_count: 16, created_at: '', updated_at: '' },
  { id: 7, name: 'Maint. Bay A',  code: 'MNT-A',   type: 'maintenance_bay', building: 'Service', floor: 'Ground', description: 'Vehicle maintenance', is_active: false, asset_count: 3,  created_at: '', updated_at: '' },
  { id: 8, name: 'Control Tower', code: 'CTL-TWR', type: 'control_tower',   building: 'Tower', floor: '8',  description: 'Air traffic control',         is_active: true,  asset_count: 5,  created_at: '', updated_at: '' },
]