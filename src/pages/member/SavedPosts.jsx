import { useEffect, useState, useRef } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import PostCard from '../../components/posts/PostCard';
import PageState from '../../components/posts/PageState';
import { getSavedPosts, toggleSave } from '../../services/interactionService';
import toast from 'react-hot-toast';

export default function SavedPosts({ isComponent = false }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  const [removing, setRemoving] = useState(null);
  const saving = useRef(false);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    getSavedPosts({ pageIndex: page, pageSize: 12 }).then(data => {
      if (!active) return;
      if (!Array.isArray(data?.items)) throw new Error('Invalid saved posts response.');
      if (page > 1 && data.items.length === 0) { setPage(page - 1); return; }
      setPosts(data.items); setTotalPages(data.totalPages);
    }).catch(err => { if (active) setError({ status: err.status, message: 'Unable to load saved posts.' }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, revision]);
  async function unsave(postId) {
    if (saving.current) return;
    saving.current = true; setRemoving(postId);
    try {
      const result = await toggleSave(postId);
      if (result.isSaved !== false) { toast.error('This post is still saved. Please try again.'); return; }
      toast.success('Removed from saved posts');
      setRevision(value => value + 1);
    } catch { toast.error('Unable to remove this post. Please try again.'); }
    finally { saving.current = false; setRemoving(null); }
  }
  return <div className={isComponent ? 'w-full' : 'min-h-screen flex flex-col bg-[#FDFBF6]'}>
    {!isComponent && <HeaderMember />}
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="font-fraunces text-4xl text-[#2B2A25] mb-3">Saved Posts</h1>
      <p className="text-[#6B6F63] mb-8">Your saved blogs and videos.</p>
      {loading || error || !posts.length ? <PageState loading={loading} error={error} empty="You haven't saved any posts yet." onRetry={() => setRevision(value => value + 1)} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{posts.map(post => <PostCard key={post.postId} post={post} postId={post.postId} onUnsave={unsave} removing={removing === post.postId} disabled={removing !== null} />)}</div>}
      {!error && totalPages > 1 && <nav aria-label="Saved posts pages" className="flex justify-center items-center gap-5 mt-8">
        <button disabled={loading || removing !== null || page === 1} onClick={() => setPage(value => value - 1)} className="disabled:opacity-40">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={loading || removing !== null || page >= totalPages} onClick={() => setPage(value => value + 1)} className="disabled:opacity-40">Next</button>
      </nav>}
    </main>
    {!isComponent && <><AIChatbot /><Footer /></>}
  </div>;
}
