import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthSessionStatus from './AuthSessionStatus';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthenticated, isLoading, restoreError } = useAuth();
  const location = useLocation();

  if (isLoading || restoreError) {
    return <AuthSessionStatus />;
  }

  if (!isAuthenticated) {
    // Redirect to login and remember the original URL they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'Admin' && user?.roleName !== 'Admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}
