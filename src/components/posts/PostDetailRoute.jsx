import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthSessionStatus from '../layout/AuthSessionStatus';
import PostDetail from '../../pages/member/PostDetail';
import PostDetailGuest from '../../pages/guest/PostDetailGuest';

export default function PostDetailRoute() {
  const { isAuthenticated, isLoading, restoreError } = useAuth();
  if (isLoading || restoreError) return <AuthSessionStatus />;
  return isAuthenticated ? <PostDetail /> : <PostDetailGuest />;
}

export function LegacyPostDetailRedirect() {
  const { id } = useParams();
  const location = useLocation();
  return <Navigate replace to={{ pathname: `/posts/${id}`, search: location.search, hash: location.hash }} state={location.state} />;
}
