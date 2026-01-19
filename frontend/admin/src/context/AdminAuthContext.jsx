// ============================================
// FILE: frontend/admin/src/context/AdminAuthContext.jsx
// FIXED - Proper initialization and race condition handling
// ============================================
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getCurrentAdmin, logout as logoutApi } from '../api/authApi';
import { toast } from 'react-hot-toast';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authCheckAttempted = useRef(false);

  useEffect(() => {
    if (!authCheckAttempted.current) {
      authCheckAttempted.current = true;
      checkAuth();
    }

    const handleUnauthorized = () => {
      handleSessionExpired();
    };

    window.addEventListener('admin:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('admin:unauthorized', handleUnauthorized);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const storedAdmin = localStorage.getItem('adminData');

      console.log('🔍 AdminAuthContext - checkAuth:', { 
        hasToken: !!token, 
        hasStoredAdmin: !!storedAdmin 
      });

      if (!token || !storedAdmin) {
        console.log('❌ No credentials found');
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Set admin from localStorage immediately
      const adminData = JSON.parse(storedAdmin);
      console.log('✅ Admin loaded from localStorage:', adminData.email);
      setAdmin(adminData);
      setIsAuthenticated(true);
      setLoading(false);

      // Verify in background
      try {
        const response = await getCurrentAdmin();
        if (response.success) {
          console.log('✅ Admin verified with API');
          setAdmin(response.data);
          localStorage.setItem('adminData', JSON.stringify(response.data));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('❌ Token expired');
          handleSessionExpired();
        }
      }

    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setLoading(false);
      setIsAuthenticated(false);
    }
  };

  const handleSessionExpired = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    setIsAuthenticated(false);
    toast.error('Your session has expired. Please login again.', {
      duration: 5000,
      id: 'session-expired',
    });
  };

  const login = (token, adminData) => {
    console.log('🔐 AdminAuthContext - login called:', adminData.email);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setAdmin(adminData);
    setIsAuthenticated(true);
    setLoading(false); // Important: set loading to false after login
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  const updateAdmin = (updatedData) => {
    const updated = { ...admin, ...updatedData };
    setAdmin(updated);
    localStorage.setItem('adminData', JSON.stringify(updated));
  };

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
    updateAdmin,
    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};