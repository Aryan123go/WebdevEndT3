import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/ui/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import QueueStatus from './pages/QueueStatus';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth />} />
          
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Area with Layout */}
          <Route element={<Layout />}>
            
            {/* Student Routes */}
            <Route element={<ProtectedRoute requireRole="student" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/queue/:id" element={<QueueStatus />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute requireRole="admin" />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
