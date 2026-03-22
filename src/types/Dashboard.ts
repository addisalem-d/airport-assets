export interface DashboardSummary {
  total_assets: number
  active_assets: number
  assets_under_maintenance: number
  total_locations: number
  active_users: number
  open_maintenance_tickets: number
  overdue_maintenance: number
  total_asset_value: number
  maintenance_completion_rate: number
  assets_by_category: Array<{ category: string; count: number }>
  assets_by_status: Array<{ status: string; count: number }>
  maintenance_trend: Array<{ date: string; completed: number; open: number }>
  total_users: number
}
