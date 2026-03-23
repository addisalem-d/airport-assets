import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ui/ErrorBoundary'

const Dashboard   = lazy(() => import('./pages/dashboard/Dashboard'))
const Assets      = lazy(() => import('./pages/assets/AssetsList'))
const Maintenance = lazy(() => import('./pages/maintenance/Maintenance'))
const Locations   = lazy(() => import('./pages/locations/Locations'))
const Users       = lazy(() => import('./pages/users/UserManagement'))
const Reports     = lazy(() => import('./pages/reports/Reports'))
const Login       = lazy(() => import('./pages/Login'))

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e5e5', borderTopColor: '#4f7cff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Page><Login /></Page>} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"   element={<Page><Dashboard /></Page>} />
        <Route path="/assets"      element={<Page><Assets /></Page>} />
        <Route path="/maintenance" element={<Page><Maintenance /></Page>} />
        <Route path="/locations"   element={<Page><Locations /></Page>} />
        <Route path="/users"       element={<Page><Users /></Page>} />
        <Route path="/reports"     element={<Page><Reports /></Page>} />
        <Route path="*"            element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}