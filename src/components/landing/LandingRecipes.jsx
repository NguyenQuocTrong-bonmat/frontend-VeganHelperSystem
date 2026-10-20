import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getPostsFeed, searchPosts } from '../../services/postService';
import { getImageUrl } from '../../utils/imageUtils';
import LandingIcon from './LandingIcon';
import LandingReveal from './LandingReveal';

function RecipeMedia({ post }) {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(post.thumbnailUrl);
  const video = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url || '') || url?.includes('/videos/');
  return <div className="lp-recipe-media">
    {url && !failed ? video
      ? <video src={url} muted playsInline preload="metadata" onError={() => setFailed(true)} aria-label={`Video preview: ${post.title}`} />
      : <img src={url} alt={post.title} loading="lazy" onError={() => setFailed(true)} />
      : <div className="lp-recipe-fallback"><LandingIcon name="bowl" width="54" height="54" /><span>From the community kitchen</span></div>}
    <span className="lp-media-label">{video ? 'Community video' : 'Community post'}</span>
  </div>;
}

export default function LandingRecipes({ onAuthRequired, onCommunityLoaded }) {
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCategories().then(data => { if (!cancelled) setCategories(Array.isArray(data) ? data : data?.items ?? []); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    const timer = setTimeout(async () => {
      try {
        const data = keyword.trim()
          ? await searchPosts({ keyword: keyword.trim(), pageSize: 6 })
          : await getPostsFeed({ pageSize: 6, categoryId });
        if (cancelled) return;
        setPosts(data.items ?? []);
        if (!keyword.trim() && categoryId === null) {
          const count = data.totalItems ?? data.totalCount;
          onCommunityLoaded({ items: data.items ?? [], total: typeof count === 'number' ? count : null });
        }
      } catch {
        if (!cancelled) { setPosts([]); setError(true); }
      } finally { if (!cancelled) setLoading(false); }
    }, keyword.trim() ? 350 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [keyword, categoryId, retry, onCommunityLoaded]);

  return <section id="recipes" data-landing-chapter="recipes" className="lp-section lp-recipes" aria-labelledby="landing-recipes-title">
    <div className="lp-container">
      <LandingReveal className="lp-section-heading">
        <div><p className="lp-eyebrow"><span />From our community kitchens</p><h2 id="landing-recipes-title">Good food.<br className="lp-mobile-only" /> Even better shared.</h2></div>
        <Link to="/search-guest" className="lp-text-link">Explore all posts <LandingIcon name="arrow" /></Link>
      </LandingReveal>
      <div className="lp-recipe-toolbar">
        <form className="lp-recipe-search" role="search" onSubmit={event => event.preventDefault()}>
          <LandingIcon name="search" width="19" height="19" />
          <label htmlFor="landing-recipe-search" className="sr-only">Search community recipes and posts</label>
          <input id="landing-recipe-search" type="search" value={keyword} placeholder="What would you like to cook?" onChange={event => { setKeyword(event.target.value); setCategoryId(null); }} />
        </form>
        <div className="lp-category-filters" aria-label="Filter posts by category">
          <button type="button" aria-pressed={categoryId === null && !keyword} className={categoryId === null && !keyword ? 'is-active' : ''} onClick={() => { setCategoryId(null); setKeyword(''); }}>All posts</button>
          {categories.slice(0, 5).map(category => <button key={category.id} type="button" aria-pressed={categoryId === category.id} className={categoryId === category.id ? 'is-active' : ''} onClick={() => { setCategoryId(category.id); setKeyword(''); }}>{category.name}</button>)}
        </div>
      </div>
      <div className="lp-recipe-status" role="status" aria-live="polite">{loading ? 'Finding fresh inspiration…' : keyword.trim() ? `Showing results for “${keyword.trim()}”` : ''}</div>
      {loading ? <div className="lp-recipe-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="lp-recipe-skeleton" key={index}><div /><span /><span /></div>)}</div>
        : error ? <div className="lp-data-message" role="alert"><LandingIcon name="bowl" width="36" height="36" /><h3>The kitchen is taking a moment.</h3><p>We could not load community posts. Please try again.</p><button className="lp-button lp-button-outline" type="button" onClick={() => setRetry(value => value + 1)}>Try again</button></div>
          : !posts.length ? <div className="lp-data-message"><LandingIcon name="search" width="36" height="36" /><h3>A new discovery is around the corner.</h3><p>No posts match this selection. Try another search or category.</p><button type="button" className="lp-button lp-button-outline" onClick={() => { setKeyword(''); setCategoryId(null); }}>Show all posts</button></div>
            : <div className="lp-recipe-grid">{posts.map((post, index) => <LandingReveal className="lp-recipe-entrance" key={post.id} delay={index * 0.055}><article className="lp-recipe-card">
              <Link to={`/posts/${post.id}/guest`} className="lp-recipe-cover" aria-label={`Read ${post.title}`}><RecipeMedia key={`${post.id}-${post.thumbnailUrl}`} post={post} /></Link>
              <div className="lp-recipe-copy"><div className="lp-recipe-meta"><span>Plant-based inspiration</span><button type="button" className="lp-save-button" aria-label={`Save ${post.title}`} onClick={() => onAuthRequired('Create an account or log in to save your favorite posts and return to them anytime.')}><LandingIcon name="bookmark" width="18" height="18" /></button></div>
                <h3><Link to={`/posts/${post.id}/guest`}>{post.title}</Link></h3>
                <div className="lp-recipe-bottom"><span className="lp-author-initial" aria-hidden="true">{post.authorName?.charAt(0)?.toUpperCase() || 'V'}</span><span className="lp-recipe-author">{post.authorName || 'Community member'}</span><button type="button" className="lp-like-button" aria-label={`Like ${post.title}`} onClick={() => onAuthRequired('Log in to like posts, leave a comment and cheer on your fellow cooks.')}><LandingIcon name="heart" width="18" height="18" /></button></div>
              </div>
            </article></LandingReveal>)}</div>}
      <p className="lp-section-note"><LandingIcon name="leaf" width="16" height="16" /> Browse freely. Join when you are ready to save, share and connect.</p>
    </div>
  </section>;
}
