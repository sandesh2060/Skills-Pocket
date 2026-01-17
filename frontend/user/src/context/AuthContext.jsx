// ============================================
// FILE: frontend/user/src/context/AuthContext.jsx
// ============================================
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as logoutApi } from '../api/authApi';
import { getAuthData, clearAuthData, storeAuthData } from '../utils/authUtils';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { token, user: storedUser, userType: storedUserType } = getAuthData();
      
      if (token && storedUser) {
        // Verify token is still valid by fetching current user
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
          setUserType(storedUserType);
          setIsAuthenticated(true);
        } else {
          clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData, type) => {
    storeAuthData(token, userData, type);
    setUser(userData);
    setUserType(type);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storeAuthData(getAuthData().token, updatedUser, userType);
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};