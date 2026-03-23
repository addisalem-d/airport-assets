export type MaintenanceStatus   = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical'
export type MaintenanceType     = 'preventive' | 'corrective' | 'inspection' | 'emergency'

export interface MaintenanceLog {
  id: number
  asset_id: number
  asset_name?: string
  assigned_to: number
  assigned_name?: string
  type: MaintenanceType
  priority: MaintenancePriority
  status: MaintenanceStatus
  title: string
  description: string
  scheduled_date: string
  completed_at: string | null
  cost: number | null
  notes: string
  created_at: string
  updated_at: string
}

export interface CreateMaintenancePayload {
  asset_id: number
  assigned_to: number
  type: MaintenanceType
  priority: MaintenancePriority
  title: string
  description: string
  scheduled_date: string
  notes?: string
}

export const STATUS_COLORS: Record<MaintenanceStatus, string> = {
  scheduled:   '#4f7cff',
  in_progress: '#f5a623',
  completed:   '#22c48a',
  cancelled:   '#bbb',
  overdue:     '#f05252',
}

export const PRIORITY_COLORS: Record<MaintenancePriority, string> = {
  low:      '#22c48a',
  medium:   '#f5a623',
  high:     '#f05252',
  critical: '#7c3aed',
}