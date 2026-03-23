import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard'   },
  { to: '/assets',      label: 'All Assets'  },
  { to: '/locations',   label: 'Locations'   },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/reports',     label: 'Reports'     },
  { to: '/users',       label: 'Users'       },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <aside style={{ width: 220, background: '#0d0d17', display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', padding: '0 10px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
          Airport Assets
        </div>

        <nav style={{ flex: 1 }}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '9px 12px',
                borderRadius: 8,
                fontSize: 13,
                color: isActive ? '#a5b4fc' : '#64748b',
                background: isActive ? 'rgba(79,124,255,0.15)' : 'transparent',
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.15s',
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 12px' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #4f7cff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {user?.avatar_initials ?? user?.username?.slice(0,2).toUpperCase() ?? '??'}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>{user?.name ?? user?.username ?? 'User'}</div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>{user?.role ?? ''}</div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{ width: '100%', padding: '9px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'color 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.color = '#e2e8f0')}
            onMouseOut={e  => (e.currentTarget.style.color = '#64748b')}
          >
            ⇥ Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f7f4' }}>
        <Outlet />
      </main>
    </div>
  )
}