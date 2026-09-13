import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice';
import './styles/global.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FileManager from './pages/FileManager';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--black)',
        color: 'var(--white)'
      }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/files" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/files" /> : <Register />} 
        />

        {/* Защищенные маршруты */}
        <Route 
          path="/files" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FileManager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;