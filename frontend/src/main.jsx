import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import AdminApp from './AdminApp.jsx';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import './index.css';

// Composant pour gérer la redirection automatique
function AppRouter() {
  const { user, isAuthenticated } = useAuth();
  const { admin, isAdminAuthenticated } = useAdmin();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAdminAuthenticated && admin ? <Navigate to="/admin" /> :
            isAuthenticated && user ? <Navigate to="/home" /> : <Auth />
          }
        />
        <Route
          path="/login"
          element={
            isAdminAuthenticated && admin ? <Navigate to="/admin" /> :
            isAuthenticated && user ? <Navigate to="/home" /> : <Auth />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated && user ? <App /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin"
          element={
            isAdminAuthenticated && admin ? <AdminApp /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminProvider>
        <AppRouter />
      </AdminProvider>
    </AuthProvider>
  </React.StrictMode>,
);
