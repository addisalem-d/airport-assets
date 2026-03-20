import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'

const Dashboard   = lazy(() => import('./pages/dashboard/Dashboard'))
const Assets      = lazy(() => import('./pages/assets/AssetsList'))
const Maintenance = lazy(() => import('./pages/maintenance/Maintenance'))
const Locations   = lazy(() => import('./pages/locations/Locations'))
const Users       = lazy(() => import('./pages/users/UserManagement'))

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e5e5e5', borderTopColor: '#4f7cff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"   element={<Suspense fallback={<Spinner />}><Dashboard /></Suspense>} />
        <Route path="/assets"      element={<Suspense fallback={<Spinner />}><Assets /></Suspense>} />
        <Route path="/maintenance" element={<Suspense fallback={<Spinner />}><Maintenance /></Suspense>} />
        <Route path="/locations"   element={<Suspense fallback={<Spinner />}><Locations /></Suspense>} />
        <Route path="/users"       element={<Suspense fallback={<Spinner />}><Users /></Suspense>} />
        <Route path="*"            element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}