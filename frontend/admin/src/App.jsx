// ============================================
// FILE: frontend/admin/src/App.jsx
// UPDATED - Added Settings route
// ============================================
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Layout
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import JobManagement from "./pages/JobManagement";
import DisputeManagement from "./pages/DisputeManagement";
import Settings from "./pages/Settings"; 
import HelpCenter from "./pages/HelpCenter";
import FinancialMonitoring from "./pages/FinancialMonitoring";

// URL Auth Handler - Captures credentials from URL params
const URLAuthHandler = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const adminEncoded = params.get("admin");

    console.log("🔍 URLAuthHandler - Full location:", {
      pathname: location.pathname,
      search: location.search,
      hasToken: !!token,
      hasAdmin: !!adminEncoded,
      tokenPreview: token ? token.substring(0, 20) + '...' : null
    });

    if (token && adminEncoded) {
      try {
        // Decode admin data
        const adminData = JSON.parse(atob(adminEncoded));
        
        console.log("✅ Admin credentials decoded:", {
          email: adminData.email,
          role: adminData.role,
          id: adminData.id
        });
        
        // Store credentials in localStorage FIRST
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        
        console.log('✅ Credentials stored in localStorage');
        
        // THEN call context login
        login(token, adminData);
        
        console.log('✅ Context login called');
        
        // Clean URL (remove credentials from URL)
        const cleanPath = location.pathname || '/dashboard';
        console.log('🧹 Cleaning URL, navigating to:', cleanPath);
        navigate(cleanPath, { replace: true });
      } catch (error) {
        console.error("❌ Failed to process auth credentials:", error);
      }
    } else {
      console.log('ℹ️ No auth params in URL');
    }
  }, [location.search]);

  return children;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  console.log('🛡️ ProtectedRoute - Auth status:', { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleLoginRedirect = () => {
      console.log('🖱️ Login button clicked');
      console.log('🔄 Redirecting to: http://localhost:5173/login');
      
      // Method 1: Direct location change
      try {
        window.location.href = 'http://localhost:5173/login';
      } catch (error) {
        console.error('❌ Redirect failed:', error);
        // Fallback method
        window.open('http://localhost:5173/login', '_self');
      }
    };

    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center max-w-md p-8 bg-slate-800 rounded-lg border border-slate-700 shadow-2xl">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Admin Access Required
          </h2>

          {/* Description */}
          <p className="text-slate-400 mb-6 leading-relaxed">
            Please login from the main portal with your admin credentials to access the admin dashboard.
          </p>

          {/* Login Button */}
          <button
            onClick={handleLoginRedirect}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-500">
              Login with your admin email
            </p>
            <p className="text-xs text-slate-600 mt-1">
              (e.g., *@admin.skillspocket.com)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <URLAuthHandler>
          <Toaster position="top-right" />
          <Routes>
            {/* Protected Routes - Wrapped in layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/jobs" element={<JobManagement />} />
              <Route path="/disputes" element={<DisputeManagement />} />
              <Route path="/settings" element={<Settings />} /> 
               <Route path="/help" element={<HelpCenter/>} /> 
              <Route path="/financial" element={<FinancialMonitoring />} />

            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </URLAuthHandler>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;