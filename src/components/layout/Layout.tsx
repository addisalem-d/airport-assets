import { Outlet, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard',   label: 'Dashboard'   },
  { to: '/assets',      label: 'All Assets'  },
  { to: '/locations',   label: 'Locations'   },
  { to: '/maintenance', label: 'Maintenance' },
  { to: '/users',       label: 'Users'       },
]

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <aside style={{ width: 220, background: '#0d0d17', display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', padding: '0 10px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
          Airport Assets
        </div>
        <nav>
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
      </aside>
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f7f4' }}>
        <Outlet />
      </main>
    </div>
  )
}