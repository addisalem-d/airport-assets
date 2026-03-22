import { useEffect, useState } from 'react'
import type { Location, CreateLocationPayload } from '../../types/Location'
import { locationService } from '../../services/locationService'
import { LOCATION_TYPES } from '../../types/Location'
import styles from './Locations.module.css'

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState<CreateLocationPayload>({ name: '', code: '', type: 'terminal' })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.name || !form.code) return
    setSaving(true)
    await locationService.create(form)
    onSave(); onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Add location</h2>
        <div className={styles.field}><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Terminal A" /></div>
        <div className={styles.field}><label>Code</label><input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="TERM-A" /></div>
        <div className={styles.field}>
          <label>Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {LOCATION_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className={styles.field}><label>Description</label><textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="Brief description…" /></div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Add'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  async function load() {
    setLoading(true)
    setLocations(await locationService.getAll())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1>Locations</h1><p>Airport zones and facilities</p></div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add Location</button>
      </div>

      <input className={styles.search} placeholder="Search by name or code…" value={search} onChange={e => setSearch(e.target.value)} />

      {loading && <p className={styles.empty}>Loading…</p>}

      <div className={styles.grid}>
        {filtered.map((loc, i) => (
          <div key={loc.id} className={styles.card} style={{ animationDelay: `${i * 0.04}s` }}>
            <div className={styles.cardTop}>
              <span className={styles.code}>{loc.code}</span>
              <span className={styles.dot} style={{ background: loc.is_active ? '#22c48a' : '#bbb' }} />
            </div>
            <div className={styles.name}>{loc.name}</div>
            <div className={styles.type}>{loc.type.replace('_', ' ')}</div>
            {loc.description && <div className={styles.desc}>{loc.description}</div>}
            <div className={styles.meta}>
              {loc.building && <span className={styles.tag}>{loc.building}</span>}
              {loc.floor    && <span className={styles.tag}>Floor {loc.floor}</span>}
              {loc.asset_count !== undefined && <span className={styles.count}>{loc.asset_count} assets</span>}
            </div>
          </div>
        ))}
      </div>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={load} />}
    </div>
  )
}