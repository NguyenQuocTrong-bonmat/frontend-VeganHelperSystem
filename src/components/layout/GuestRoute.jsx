import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthSessionStatus from './AuthSessionStatus';

export default function GuestRoute({ children }) {
  const { isLoading, isAuthenticated, restoreError } = useAuth();
  if (isLoading || restoreError) return <AuthSessionStatus />;
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}
