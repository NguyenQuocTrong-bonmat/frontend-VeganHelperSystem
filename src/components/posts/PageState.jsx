import { Link } from 'react-router-dom';
export default function PageState({ loading, error, empty, onRetry }) {
  if (loading) return <div role="status" className="py-20 text-center text-[#6B6F63]">Loading…</div>;
  if (error) return <div role="alert" className="py-20 text-center space-y-4">
    <p>{error.status === 401 ? 'Please sign in to continue.' : error.status === 403 ? 'You do not have permission to view this content.' : error.status === 404 ? 'User not found or no longer available.' : error.message}</p>
    {error.status === 401 ? <Link to="/login">Sign in</Link> : onRetry && error.status !== 404 && <button className="px-6 py-2 bg-[#2F5233] text-white rounded-lg" onClick={onRetry}>Try again</button>}
    <p><Link to="/home" className="text-[#2F5233]">Explore community posts</Link></p>
  </div>;
  return <div className="py-20 text-center border rounded-xl"><p>{empty}</p><Link to="/home" className="text-[#2F5233]">Explore community posts</Link></div>;
}
