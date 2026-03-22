import { useEffect, useState } from 'react'
import BarChart from '../../components/charts/BarChart'
import { dashboardService } from '../../services/dashboardService'
import type { DashboardSummary } from '../../types/Dashboard'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      try {
        const data = await dashboardService.getSummary()
        if (!isMounted) return
        setSummary(data)
      } catch (err: any) {
        if (!isMounted) return
        console.error('Failed to load dashboard summary', err)
        const errorMsg = err.response?.status === 401 
          ? 'Authentication failed. Please log in again.'
          : err.response?.data?.detail || 'Unable to load dashboard data.'
        setError(errorMsg)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSummary()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <div className={styles.loading}>Loading dashboard…</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  if (!summary) {
    return <div className={styles.error}>No dashboard data available.</div>
  }

  const cards = [
    { label: 'Total users', value: summary.total_users },
    { label: 'Active users', value: summary.active_users },
    { label: 'Total assets', value: summary.total_assets },
    { label: 'Active assets', value: summary.active_assets },
    { label: 'Assets under maintenance', value: summary.assets_under_maintenance },
    { label: 'Open maintenance tickets', value: summary.open_maintenance_tickets },
    { label: 'Overdue maintenance', value: summary.overdue_maintenance },
    { label: 'Total asset value', value: `$${summary.total_asset_value.toLocaleString()}` },
  ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Overview of asset and user metrics</p>
      </header>

      <div className={styles.cards}>
        {cards.map(card => (
          <div key={card.label} className={styles.card}>
            <div className={styles.cardLabel}>{card.label}</div>
            <div className={styles.cardValue}>{card.value}</div>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <h2>Assets by status</h2>
        {summary.assets_by_status.length > 0 ? (
          <BarChart
            data={summary.assets_by_status.map((item) => ({ label: item.status, value: item.count }))}
            width={720}
            height={320}
          />
        ) : (
          <div>No asset status data yet.</div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Assets by category</h2>
        <div className={styles.list}>
          {summary.assets_by_category.length > 0 ? (
            summary.assets_by_category.map((item, index) => (
              <div key={index} className={styles.listItem}>
                <strong>{item.category}</strong>: {item.count}
              </div>
            ))
          ) : (
            <div>No category data yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}
