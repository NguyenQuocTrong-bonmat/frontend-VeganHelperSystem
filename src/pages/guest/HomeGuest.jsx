import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingAuthDialog from '../../components/landing/LandingAuthDialog';
import LandingRecipes from '../../components/landing/LandingRecipes';
import LandingIcon from '../../components/landing/LandingIcon';
import LandingHero from '../../components/landing/LandingHero';
import LandingPillars from '../../components/landing/LandingPillars';
import LandingReveal from '../../components/landing/LandingReveal';
import useLandingSectionScroll from '../../components/landing/useLandingSectionScroll';
import { WeeklyMenuPreview, VeganStorePreview } from '../../components/landing/LandingPreviews';
import heroFood from '../../assets/images/hero/hero-vietnamese-vegan-food.webp';
import './landing-page.css';

export default function HomeGuest() {
  useLandingSectionScroll();
  const [authReason, setAuthReason] = useState('');
  const [community, setCommunity] = useState({ items: [], total: null });
  const closeAuth = useCallback(() => setAuthReason(''), []);
  const handleCommunityLoaded = useCallback(data => setCommunity(data), []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Vegan Helper — Plant-based living, made everyday';
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = 'Discover plant-based recipes, explore vegan living in Vietnam and preview personalized weekly menus with the Vegan Helper community.';
    document.head.appendChild(description);
    return () => { document.title = previousTitle; description.remove(); };
  }, []);

  return <div className="lp-page">
    <a className="lp-skip-link" href="#landing-main">Skip to content</a>
    <LandingHeader />
    <main id="landing-main">
      <LandingHero />

      <div className="lp-promise-strip" aria-label="Explore the Vegan Helper platform"><div className="lp-container"><span><LandingIcon name="bowl" />Discover something delicious</span><span className="lp-promise-divider" aria-hidden="true">✳</span><span><LandingIcon name="calendar" />Make room for a good week</span><span className="lp-promise-divider" aria-hidden="true">✳</span><span><LandingIcon name="people" />Grow with a community</span></div></div>

      <LandingRecipes onAuthRequired={setAuthReason} onCommunityLoaded={handleCommunityLoaded} />

      <LandingPillars />

      <WeeklyMenuPreview onAuthRequired={setAuthReason} />
      <VeganStorePreview onAuthRequired={setAuthReason} />

      <section id="community" data-landing-chapter="community" className="lp-section lp-community" aria-labelledby="landing-community-title"><div className="lp-container">
        <div className="lp-community-intro"><LandingReveal depth className="lp-community-image"><img src={heroFood} alt="A colorful Vietnamese plant-based meal ready to share" loading="lazy" /><span>Something good is always growing.</span></LandingReveal><LandingReveal className="lp-community-copy"><p className="lp-eyebrow"><span />A seat at the table for everyone</p><h2 id="landing-community-title">Come for the food.<br /><em>Stay for the people.</em></h2><p>Your first tofu experiment. Your family recipe, reimagined. Your favorite neighborhood find. There is room for all of it here.</p><p>Read what others are sharing, then add your own story when you are ready.</p><Link to="/sign-up" className="lp-text-link">Join the Community <LandingIcon name="arrow" /></Link></LandingReveal></div>
        <LandingReveal className="lp-community-stats"><div><strong>{community.total === null ? 'Together' : community.total.toLocaleString('en-US')}</strong><span>{community.total === null ? 'A community built around sharing' : 'Public posts in the community'}</span></div><div><strong>7 days</strong><span>A whole week of meal ideas</span></div><div><strong>Your pace</strong><span>Every plant-based journey is welcome</span></div></LandingReveal>
        {community.items.length > 0 && <div className="lp-community-posts"><div className="lp-community-posts-heading"><p className="lp-eyebrow">Fresh from the community</p><span>Real posts. Everyday inspiration.</span></div><div className="lp-story-grid">{community.items.slice(0, 3).map(post => <article key={post.id} className="lp-story"><div className="lp-story-author"><span className="lp-author-initial" aria-hidden="true">{post.authorName?.charAt(0)?.toUpperCase() || 'V'}</span><span>{post.authorName || 'Community member'}<small>Shared a community post</small></span><button type="button" className="lp-follow-button" onClick={() => setAuthReason('Log in to follow creators and keep up with the people who inspire your cooking.')} aria-label={`Follow ${post.authorName || 'this creator'}`}>Follow</button></div><h3><Link to={`/posts/${post.id}/guest`}>{post.title}</Link></h3><Link to={`/posts/${post.id}/guest`} className="lp-text-link">Read their post <LandingIcon name="arrow" width="17" height="17" /></Link></article>)}</div></div>}
      </div></section>

      <section className="lp-final-cta" aria-labelledby="landing-final-title"><LandingReveal className="lp-container"><span className="lp-final-leaf"><LandingIcon name="leaf" width="38" height="38" /></span><p className="lp-eyebrow">One small step. So many good possibilities.</p><h2 id="landing-final-title">Start your plant-based<br /><em>journey today.</em></h2><p>Find a recipe. Make a plan. Meet your people.<br />A greener everyday starts wherever you are.</p><div className="lp-final-actions"><Link className="lp-button lp-button-light" to="/sign-up">Create an Account <LandingIcon name="arrow" /></Link><Link className="lp-button lp-button-on-dark" to="/login">Log in</Link></div><span className="lp-final-note">Explore freely. Join when it feels right.</span></LandingReveal></section>
    </main>

    <footer className="lp-footer"><div className="lp-container"><div className="lp-footer-main"><Link className="lp-logo" to="/" aria-label="Vegan Helper home"><img src="/logo.png" alt="Vegan Helper" /></Link><p>Rooted in good food.<br />Growing together.</p><nav aria-label="Footer navigation"><a href="#recipes">Recipes</a><a href="#weekly-menu-preview">Weekly Menu</a><a href="#stores">Vegan Stores</a><a href="#community">Community</a></nav></div><div className="lp-footer-bottom"><span>© {new Date().getFullYear()} Vegan Helper</span><span>Made for everyday plant-based living in Vietnam.</span><a href="#landing-main">Back to top ↑</a></div></div></footer>
    <LandingAuthDialog reason={authReason} onClose={closeAuth} />
  </div>;
}
