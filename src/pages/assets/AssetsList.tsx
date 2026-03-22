import { useEffect, useState } from 'react'
import type { Asset, CreateAssetPayload } from '../../types/Asset'
import { ASSET_CATEGORIES, ASSET_STATUSES, CATEGORY_LABEL, STATUS_COLORS } from '../../types/Asset'
import { assetService } from '../../services/assetService'
import styles from './AssetsList.module.css'

const fmt = (n: number) => `$${n.toLocaleString()}`

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function AssetModal({ asset, onClose, onSave }: { asset?: Asset | null; onClose: () => void; onSave: () => void }) {
  const isEdit = !!asset
  const [form, setForm] = useState<CreateAssetPayload>({
    name:           asset?.name           ?? '',
    serial_number:  asset?.serial_number  ?? '',
    category:       asset?.category       ?? 'ground_support',
    status:         asset?.status         ?? 'active',
    location_id:    asset?.location_id    ?? 1,
    purchase_date:  asset?.purchase_date  ?? '',
    purchase_price: asset?.purchase_price ?? 0,
    notes:          asset?.notes          ?? '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.name || !form.serial_number) return
    setSaving(true)
    try {
      if (isEdit) await assetService.update(asset!.id, form)
      else await assetService.create(form)
      onSave(); onClose()
    } finally { setSaving(false) }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit asset' : 'Add asset'}</h2>

        <div className={styles.row2}>
          <div className={styles.field}><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Baggage Tug #1" /></div>
          <div className={styles.field}><label>Serial number</label><input value={form.serial_number} onChange={e => set('serial_number', e.target.value)} placeholder="BT-001" /></div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {ASSET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}><label>Purchase date</label><input type="date" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} /></div>
          <div className={styles.field}><label>Purchase price</label><input type="number" value={form.purchase_price} onChange={e => set('purchase_price', Number(e.target.value))} /></div>
        </div>

        <div className={styles.field}><label>Notes</label><input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes…" /></div>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={submit} disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save' : 'Add asset'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteModal({ asset, onClose, onConfirm }: { asset: Asset; onClose: () => void; onConfirm: () => void }) {
  const [deleting, setDeleting] = useState(false)
  async function confirm() {
    setDeleting(true)
    await assetService.remove(asset.id)
    onConfirm(); onClose()
  }
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>Delete asset</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Delete <strong>{asset.name}</strong>?</p>
        <p style={{ fontSize: 12, color: '#f05252' }}>This cannot be undone.</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.dangerBtn} onClick={confirm} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssetsList() {
  const [assets,   setAssets]   = useState<Asset[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')
  const [showAdd,  setShowAdd]  = useState(false)
  const [editAsset,   setEditAsset]   = useState<Asset | null>(null)
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null)

  async function load() {
    setLoading(true)
    setAssets(await assetService.getAll())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = assets.filter(a => {
    const matchSearch   = a.name.toLowerCase().includes(search.toLowerCase()) || a.serial_number.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'all' || a.category === category
    return matchSearch && matchCategory
  })

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div><h1>All Assets</h1><p>Manage airport assets</p></div>
        <span style={{ fontSize: 12, color: '#aaa' }}>{assets.length} total</span>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search by name or serial…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {ASSET_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </select>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add Asset</button>
      </div>

      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>Asset</span><span>Category</span><span>Location</span><span>Price</span><span>Status</span><span>Actions</span>
        </div>

        {loading && <div className={styles.empty}>Loading assets…</div>}
        {!loading && filtered.length === 0 && <div className={styles.empty}>No assets found</div>}

        {!loading && filtered.map((a, i) => (
          <div key={a.id} className={styles.row} style={{ animationDelay: `${i * 0.03}s` }}>
            <div>
              <div className={styles.assetName}>{a.name}</div>
              <div className={styles.assetSerial}>{a.serial_number}</div>
            </div>
            <span className={styles.category}>{CATEGORY_LABEL[a.category]}</span>
            <span className={styles.location}>{a.location_name ?? `Location ${a.location_id}`}</span>
            <span className={styles.price}>{fmt(a.purchase_price)}</span>
            <span className={styles.status} style={{ background: `${STATUS_COLORS[a.status]}18`, color: STATUS_COLORS[a.status] }}>
              ● {a.status}
            </span>
            <div className={styles.actions}>
              <button className={styles.editBtn}   onClick={() => setEditAsset(a)}>✏</button>
              <button className={styles.deleteBtn} onClick={() => setDeleteAsset(a)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd     && <AssetModal onClose={() => setShowAdd(false)} onSave={load} />}
      {editAsset   && <AssetModal asset={editAsset} onClose={() => setEditAsset(null)} onSave={load} />}
      {deleteAsset && <DeleteModal asset={deleteAsset} onClose={() => setDeleteAsset(null)} onConfirm={load} />}
    </div>
  )
}