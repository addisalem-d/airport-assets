import type { DashboardSummary } from '../types/Dashboard'
import { api } from './api'

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>('/dashboard/summary')
    return response.data
  },
}
