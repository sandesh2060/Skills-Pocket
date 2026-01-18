// ============================================
// FILE: frontend/user/src/context/AuthContext.jsx
// FIXED VERSION - Proper error handling & network resilience
// ============================================
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getCurrentUser, logout as logoutApi } from "../api/authApi";
import {
  getAuthData,
  clearAuthData,
  storeAuthData,
  isTokenExpired,
} from "../utils/authUtils";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const authCheckAttempted = useRef(false);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Network connection restored');
      // Re-verify auth when coming back online
      if (user) {
        verifyAuthInBackground();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📡 Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Check auth on mount
  useEffect(() => {
    if (!authCheckAttempted.current) {
      authCheckAttempted.current = true;
      checkAuth();
    }

    // Listen for unauthorized events from API interceptor
    const handleUnauthorized = (event) => {
      console.log("🚫 Unauthorized event received:", event.detail);
      handleSessionExpired();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { token, user: storedUser, userType: storedUserType } = getAuthData();
      
      console.log('🔍 CheckAuth - Stored data:', { 
        hasToken: !!token, 
        hasUser: !!storedUser, 
        userType: storedUserType,
        isOnline: navigator.onLine
      });
      
      // No token or user stored
      if (!token || !storedUser) {
        console.log('❌ No token or user found');
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired()) {
        console.log('⏰ Token is expired, clearing auth data');
        clearAuthData();
        setLoading(false);
        toast.error("Your session has expired. Please login again.");
        return;
      }
      
      // Set user immediately from localStorage for faster UX
      setUser(storedUser);
      setUserType(storedUserType);
      setIsAuthenticated(true);
      setLoading(false); // Stop loading immediately for better UX
      
      // Verify with API in background (non-blocking)
      verifyAuthInBackground();
      
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      setLoading(false);
    }
  };

  // Background verification - doesn't block UI
  const verifyAuthInBackground = async () => {
    if (!navigator.onLine) {
      console.log('📡 Offline - skipping auth verification');
      return;
    }

    try {
      const response = await getCurrentUser();
      if (response.success) {
        // Update with fresh data from server
        const { user: storedUser, userType: storedUserType } = getAuthData();
        setUser(response.data);
        setUserType(storedUserType);
        setIsAuthenticated(true);
        
        // Update localStorage with fresh data
        const { token } = getAuthData();
        if (token) {
          storeAuthData(token, response.data, storedUserType);
        }
        
        console.log('✅ Auth verified successfully');
      } else {
        console.warn('⚠️ API verification returned unsuccessful response');
        handleSessionExpired();
      }
    } catch (error) {
      console.error('⚠️ Auth verification failed:', error);
      
      // Only clear auth on explicit 401 errors
      if (error.response?.status === 401) {
        console.log('🚫 Unauthorized - clearing auth data');
        handleSessionExpired();
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        // Network error - keep using stored data
        console.log('📡 Network error during verification - keeping stored auth data');
        // Don't show error toast for background verification failures
      } else {
        // Other errors - log but don't clear auth
        console.log('⚠️ Unknown error during verification - keeping stored auth data');
      }
    }
  };

  const handleSessionExpired = () => {
    // Clear all auth data
    clearAuthData();
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);

    // Show toast notification (only once)
    toast.error("Your session has expired. Please login again.", {
      duration: 5000,
      id: "session-expired", // Prevents duplicate toasts
    });
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
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
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
    const { token } = getAuthData();
    if (token) {
      storeAuthData(token, updatedUser, userType);
    }
  };

  const value = {
    user,
    userType,
    loading,
    isAuthenticated,
    isOnline,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};