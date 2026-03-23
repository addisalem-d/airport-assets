import { useEffect, useState } from 'react'
import type { MaintenanceLog, CreateMaintenancePayload, MaintenanceStatus } from '../../types/Maintenance'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../types/Maintenance'
import { maintenanceService } from '../../services/maintenanceService'
import styles from './Maintenance.module.css'

const STATUSES: MaintenanceStatus[] = ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue']
const TYPES    = ['preventive', 'corrective', 'inspection', 'emergency']
const PRIORITY = ['low', 'medium', 'high', 'critical']

// ─── Add Modal ────────────────────────────────────────────────────────────────
function AddModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<CreateMaintenancePayload>({
    asset_id: 1, assigned_to: 8, type: 'preventive', priority: 'medium',
    title: '', description: '', scheduled_date: '', notes: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.title || !form.scheduled_date) return
    setSaving(true)
    try {
      await maintenanceService.create(form)
      onSave(); onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Add maintenance ticket</h2>

        <div className={styles.field}><label>Title</label><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Annual belt inspection" /></div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
              {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Asset ID</label>
            <input type="number" min="1" max="10" value={form.asset_id} onChange={e => set('asset_id', Number(e.target.value))} placeholder="1-10" />
          </div>
          <div className={styles.field}>
            <label>Assigned to (user ID)</label>
            <select value={form.assigned_to} onChange={e => set('assigned_to', Number(e.target.value))}>
              <option value={8}>admin (8)</option>
              <option value={9}>user1 (9)</option>
              <option value={10}>test123 (10)</option>
            </select>
          </div>
        </div>

        <div className={styles.field}><label>Scheduled date</label><input type="date" value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)} /></div>
        <div className={styles.field}><label>Description</label><textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the work…" /></div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Add ticket'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Maintenance() {
  const [logs,    setLogs]    = useState<MaintenanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [status,  setStatus]  = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  async function load() {
    setLoading(true)
    setLogs(await maintenanceService.getAll())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleStatus(id: number, newStatus: string) {
    await maintenanceService.updateStatus(id, newStatus)
    setLogs(prev => prev.map(m => m.id === id ? { ...m, status: newStatus as MaintenanceStatus } : m))
  }

  const filtered = logs.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                        (m.asset_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || m.status === status
    return matchSearch && matchStatus
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1>Maintenance</h1><p>Track and manage asset maintenance tickets</p></div>
        <span style={{ fontSize: 12, color: '#aaa' }}>{logs.length} tickets</span>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search by title or asset…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.select} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add Ticket</button>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Title</span><span>Assignee</span><span>Priority</span><span>Scheduled</span><span>Status</span><span>Type</span>
        </div>

        {loading && <div className={styles.empty}>Loading tickets…</div>}
        {!loading && filtered.length === 0 && <div className={styles.empty}>No tickets found</div>}

        {!loading && filtered.map((m, i) => (
          <div key={m.id} className={styles.row} style={{ animationDelay: `${i * 0.03}s` }}>
            <div>
              <div className={styles.title}>{m.title}</div>
              <div className={styles.assetName}>{m.asset_name ?? `Asset #${m.asset_id}`}</div>
            </div>

            <span className={styles.assignee}>{m.assigned_name ?? `User #${m.assigned_to}`}</span>

            <span className={styles.badge} style={{ background: `${PRIORITY_COLORS[m.priority]}18`, color: PRIORITY_COLORS[m.priority] }}>
              {m.priority}
            </span>

            <span className={styles.date}>{m.scheduled_date}</span>

            <select
              className={styles.statusSelect}
              value={m.status}
              onChange={e => handleStatus(m.id, e.target.value)}
              style={{ color: STATUS_COLORS[m.status] }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>

            <span className={styles.badge} style={{ background: '#f5f3ef', color: '#666' }}>
              {m.type}
            </span>
          </div>
        ))}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={load} />}
    </div>
  )
}