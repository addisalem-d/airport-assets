import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext'; // Path to your context file
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Lazy loaded pages
const Dashboard   = lazy(() => import('./pages/dashboard/Dashboard'));
const Assets      = lazy(() => import('./pages/assets/AssetsList'));
const Maintenance = lazy(() => import('./pages/maintenance/Maintenance'));
const Locations   = lazy(() => import('./pages/locations/Locations'));
const Users       = lazy(() => import('./pages/users/UserManagement'));
const Reports     = lazy(() => import('./pages/reports/Reports'));
const Login       = lazy(() => import('./pages/Login'));

// Loading Spinner Component
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ 
        width: 32, 
        height: 32, 
        border: '3px solid #e5e5e5', 
        borderTopColor: '#4f7cff', 
        borderRadius: '50%', 
        animation: 'spin 0.7s linear infinite' 
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Wrapper for Page-level Error Boundaries and Suspense
function Page({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Protected Route Logic using Context
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // If user is not logged in, redirect to login page
  // I use replace to prevent the user from clicking "back" to a protected route
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Page><Login /></Page>} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"   element={<Page><Dashboard /></Page>} />
          <Route path="/assets"      element={<Page><Assets /></Page>} />
          <Route path="/maintenance" element={<Page><Maintenance /></Page>} />
          <Route path="/locations"   element={<Page><Locations /></Page>} />
          <Route path="/users"       element={<Page><Users /></Page>} />
          <Route path="/reports"     element={<Page><Reports /></Page>} />
          
          {/* Catch-all redirect for authenticated users */}
          <Route path="*"            element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}