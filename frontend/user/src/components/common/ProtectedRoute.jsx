// ============================================
// FILE: frontend/user/src/components/common/ProtectedRoute.jsx
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole, requiredUserType }) {
  const { user, userType, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
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
    return <Navigate to="/login" replace />;
  }

  // Check userType if required (user vs admin)
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check role if required (freelancer vs client)
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on their actual role
    const redirectPath = user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // All checks passed, render the protected content
  return children;
}