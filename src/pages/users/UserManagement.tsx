import { useEffect, useState } from 'react'
import type { User, CreateUserPayload, UpdateUserPayload } from '../../types/User'
import { userService } from '../../services/userService'
import styles from './UserManagement.module.css'

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

interface UserModalProps {
  user?: User | null
  onClose: () => void
  onSave: () => void
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const isEdit = !!user
  const [form, setForm] = useState({
    name:     user?.name     ?? '',
    username: user?.username ?? '',
    email:    user?.email    ?? '',
    role:     user?.role     ?? 'manager',
    password: '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit() {
    if (!form.name || !form.username || !form.email) { setError('All fields are required.'); return }
    if (!isEdit && !form.password) { setError('Password is required.'); return }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        const payload: UpdateUserPayload = { name: form.name, email: form.email, role: form.role as User['role'] }
        await userService.update(user!.id, payload)
      } else {
        const payload: CreateUserPayload = { ...form, role: form.role as User['role'] }
        await userService.create(payload)
      }
      onSave()
      onClose()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit user' : 'Add new user'}</h2>

        {[
          { label: 'Full name',  key: 'name',     type: 'text',     placeholder: 'Addisalem  F'         },
          { label: 'Username',   key: 'username',  type: 'text',     placeholder: 'Addisalem', disabled: isEdit },
          { label: 'Email',      key: 'email',     type: 'email',    placeholder: 'addisalem@airport.com' },
          ...(!isEdit ? [{ label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' }] : []),
        ].map(f => (
          <div className={styles.field} key={f.key}>
            <label>{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={(form as Record<string, string>)[f.key]}
              disabled={f.disabled}
              onChange={e => set(f.key, e.target.value)}
            />
          </div>
        ))}

        <div className={styles.field}>
          <label>Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="administrator">Administrator</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {error && <p style={{ color: '#f05252', fontSize: 12, margin: '8px 0 0' }}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add user'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteModalProps {
  user: User
  onClose: () => void
  onConfirm: () => void
}

function DeleteModal({ user, onClose, onConfirm }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try { await userService.remove(user.id); onConfirm(); onClose() }
    catch { setDeleting(false) }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.deleteModal}`} onClick={e => e.stopPropagation()}>
        <h2>Delete user</h2>
        <p>Are you sure you want to delete <strong>{user.name}</strong>?</p>
        <p style={{ color: '#f05252', fontSize: 12, marginTop: 6 }}>This action cannot be undone.</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const [users,   setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [role,    setRole]    = useState('all')

  const [showAdd,    setShowAdd]    = useState(false)
  const [editUser,   setEditUser]   = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  async function load() {
    setLoading(true)
    try { setUsers(await userService.getAll()) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleToggle(user: User) {
    await userService.toggleActive(user.id, !user.is_active)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u))
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.username.toLowerCase().includes(search.toLowerCase())
    const matchRole   = role === 'all' || u.role === role
    return matchSearch && matchRole
  })

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage system users and permissions</p>
        </div>
        <span style={{ fontSize: 12, color: '#aaa' }}>{users.length} total users</span>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search by name or username…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.select} value={role} onChange={e => setRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="administrator">Administrator</option>
          <option value="manager">Manager</option>
        </select>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add User</button>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <span>User</span>
          <span>Username</span>
          <span>Role</span>
          <span>Status</span>
          <span>Active</span>
          <span>Actions</span>
        </div>

        {loading && <div className={styles.empty}>Loading users…</div>}

        {!loading && filtered.length === 0 && (
          <div className={styles.empty}>No users found</div>
        )}

        {!loading && filtered.map((u, i) => (
          <div key={u.id} className={styles.row} style={{ animationDelay: `${i * 0.04}s` }}>

            {/* User */}
            <div className={styles.userCell}>
              <div className={styles.avatar}>{u.avatar_initials}</div>
              <div>
                <div className={styles.userName}>{u.name}</div>
                <div className={styles.userId}>ID: {u.id}</div>
              </div>
            </div>

            {/* Username */}
            <span className={styles.username}>{u.username}</span>

            {/* Role */}
            <span className={`${styles.roleBadge} ${styles[u.role]}`}>
              ● {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
            </span>

            {/* Status */}
            <span className={`${styles.statusBadge} ${u.is_active ? styles.active : styles.inactive}`}>
              {u.is_active ? 'Active' : 'Inactive'}
            </span>

            {/* Toggle */}
            <button
              className={`${styles.toggle} ${u.is_active ? styles.on : ''}`}
              onClick={() => handleToggle(u)}
              title={u.is_active ? 'Deactivate' : 'Activate'}
            >
              <div className={styles.toggleThumb} />
            </button>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => setEditUser(u)} title="Edit">✏</button>
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setDeleteUser(u)} title="Delete">🗑</button>
            </div>

          </div>
        ))}
      </div>

      {/* Modals */}
      {showAdd    && <UserModal onClose={() => setShowAdd(false)}    onSave={load} />}
      {editUser   && <UserModal user={editUser} onClose={() => setEditUser(null)}   onSave={load} />}
      {deleteUser && <DeleteModal user={deleteUser} onClose={() => setDeleteUser(null)} onConfirm={load} />}

    </div>
  )
}