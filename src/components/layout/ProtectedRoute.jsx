import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#2F5233] font-medium">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login and remember the original URL they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // NOTE: When backend roles are fully implemented, uncomment this to secure Admin routes
  // if (requireAdmin && user?.role !== 'Admin') {
  //   return <Navigate to="/home" replace />;
  // }

  return children;
}
