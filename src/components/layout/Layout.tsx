import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard'   },
  { to: '/assets',      label: 'All Assets'  },
  { to: '/locations',   label: 'Locations'   },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/users',       label: 'Users'       },
]

interface LayoutProps {
  onLogout?: () => void
}

export default function Layout({ onLogout }: LayoutProps) {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  function handleLogout() {
    authService.logout()
    onLogout?.()
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
              })}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{user?.name}</div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,67,67,0.1)',
              color: '#ff4343',
              border: '1px solid rgba(255,67,67,0.3)',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f7f4' }}>
        <Outlet />
      </main>
    </div>
  )
}