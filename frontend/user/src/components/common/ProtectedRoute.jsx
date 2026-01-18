// ============================================
// FILE: frontend/user/src/components/common/ProtectedRoute.jsx
// ============================================
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole, requiredUserType }) {
  const { user, userType, loading, isAuthenticated } = useAuth();

  // ADD DEBUG LOGS
  console.log('🛡️ ProtectedRoute Check:', {
    loading,
    isAuthenticated,
    hasUser: !!user,
    userType,
    userRole: user?.role,
    requiredRole,
    requiredUserType
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] dark:bg-bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4c739a] dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('❌ No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check userType if required (user vs admin)
  if (requiredUserType && userType !== requiredUserType) {
    console.log('❌ Wrong userType, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role if required (freelancer vs client)
  if (requiredRole && user.role !== requiredRole) {
    console.log('❌ Wrong role, redirecting to correct dashboard');
    const redirectPath = user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  console.log('✅ All checks passed, rendering protected content');
  return children;
}