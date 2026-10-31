import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingAuthDialog from '../../components/landing/LandingAuthDialog';
import LandingRecipes from '../../components/landing/LandingRecipes';
import LandingIcon from '../../components/landing/LandingIcon';
import LandingHero from '../../components/landing/LandingHero';
import LandingPillars from '../../components/landing/LandingPillars';
import LandingReveal from '../../components/landing/LandingReveal';
import useLandingSectionScroll from '../../components/landing/useLandingSectionScroll';
import { WeeklyMenuPreview, VeganStorePreview } from '../../components/landing/LandingPreviews';
import { easeEditorial } from '../../components/landing/motionVariants';
import heroFood from '../../assets/images/hero/hero-vietnamese-vegan-food.webp';
import AIChatbot from '../../components/chat/AIChatbot';
import './landing-page.css';

export default function HomeGuest() {
  useLandingSectionScroll();
  const [authReason, setAuthReason] = useState('');
  const [community, setCommunity] = useState({ items: [], total: null });
  const closeAuth = useCallback(() => setAuthReason(''), []);
  const handleCommunityLoaded = useCallback(data => setCommunity(data), []);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Vegan Helper — Plant-based living, made everyday';
    const description = document.createElement('meta');
    description.name = 'description';
    description.content = 'Discover plant-based recipes, explore vegan living in Vietnam and preview personalized weekly menus with the Vegan Helper community.';
    document.head.appendChild(description);
    return () => {
      document.title = previousTitle;
      description.remove();
    };
  }, []);

  return (
    <div className="lp-page">
      <a className="lp-skip-link" href="#landing-main">Skip to content</a>
      <LandingHeader />

      <main id="landing-main">
        {/* CHAPTER 01: Hero — The First Bite */}
        <LandingHero />

        {/* CHAPTER 02: Platform — More Than Recipes */}
        <LandingPillars />

        {/* CHAPTER 03: Recipes — Food Takes the Stage */}
        <LandingRecipes onAuthRequired={setAuthReason} onCommunityLoaded={handleCommunityLoaded} />

        {/* CHAPTER 04: Weekly Menu — A Week in Motion */}
        <WeeklyMenuPreview onAuthRequired={setAuthReason} />

        {/* CHAPTER 05: Vegan Stores — Good Things, Closer to Home */}
        <VeganStorePreview onAuthRequired={setAuthReason} />

        {/* CHAPTER 06: Community — Food Brings Us Together */}
        <section
          id="community"
          data-landing-chapter="community"
          className="lp-section lp-section-chapter lp-community"
          aria-labelledby="landing-community-title"
        >
          <div className="lp-container">
            <div className="lp-community-intro">
              <LandingReveal depth className="lp-community-image">
                <img src={heroFood} alt="A colorful Vietnamese plant-based meal ready to share" loading="lazy" />
                <span>Something good is always growing.</span>
              </LandingReveal>

              <LandingReveal className="lp-community-copy">
                <p className="lp-eyebrow">
                  <span />06 / Food Brings Us Together · The Shared Table
                </p>
                <h2 id="landing-community-title">
                  Come for the food.<br />
                  <em>Stay for the people.</em>
                </h2>
                <p>
                  Your first tofu experiment. Your family recipe, reimagined. Your favorite neighborhood find. There is room for all of it here.
                </p>
                <p>Read what others are sharing, then add your own story when you are ready.</p>
                <Link to="/sign-up" className="lp-text-link">
                  Join the Community <LandingIcon name="arrow" />
                </Link>
              </LandingReveal>
            </div>

            <LandingReveal className="lp-community-stats">
              <div>
                <strong>{community.total === null ? 'Together' : community.total.toLocaleString('en-US')}</strong>
                <span>{community.total === null ? 'A community built around sharing' : 'Public posts in the community'}</span>
              </div>
              <div>
                <strong>7 days</strong>
                <span>A whole week of meal ideas</span>
              </div>
              <div>
                <strong>Your pace</strong>
                <span>Every plant-based journey is welcome</span>
              </div>
            </LandingReveal>

            {community.items.length > 0 && (
              <div className="lp-community-posts">
                <div className="lp-community-posts-heading">
                  <p className="lp-eyebrow">Fresh from the community</p>
                  <span>Real posts. Everyday inspiration.</span>
                </div>
                <div className="lp-story-grid">
                  {community.items.slice(0, 3).map((post, index) => (
                    <LandingReveal key={post.id} delay={index * 0.06}>
                      <motion.article
                        className="lp-story"
                        whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.22, ease: easeEditorial } }}
                      >
                        <div className="lp-story-author">
                          <span className="lp-author-initial" aria-hidden="true">
                            {post.authorName?.charAt(0)?.toUpperCase() || 'V'}
                          </span>
                          <span>
                            {post.authorName || 'Community member'}
                            <small>Shared a community post</small>
                          </span>
                          <motion.button
                            type="button"
                            className="lp-follow-button"
                            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                            onClick={() => setAuthReason('Log in to follow creators and keep up with the people who inspire your cooking.')}
                            aria-label={`Follow ${post.authorName || 'this creator'}`}
                          >
                            Follow
                          </motion.button>
                        </div>
                        <h3>
                          <Link to={`/posts/${post.id}/guest`}>{post.title}</Link>
                        </h3>
                        <Link to={`/posts/${post.id}/guest`} className="lp-text-link">
                          Read their post <LandingIcon name="arrow" width="17" height="17" />
                        </Link>
                      </motion.article>
                    </LandingReveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CHAPTER 07: Closing — A Greener Tomorrow */}
        <section
          id="closing"
          data-landing-chapter="closing"
          className="lp-section lp-section-chapter lp-final-cta"
          aria-labelledby="landing-final-title"
        >
          <LandingReveal className="lp-container">
            <motion.span
              className="lp-final-leaf"
              animate={reducedMotion ? undefined : { y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <LandingIcon name="leaf" width="38" height="38" />
            </motion.span>
            <p className="lp-eyebrow">07 / A Greener Tomorrow · One small step</p>
            <h2 id="landing-final-title">
              Start your plant-based<br />
              <em>journey today.</em>
            </h2>
            <p>
              Find a recipe. Make a plan. Meet your people.<br />
              A greener everyday starts wherever you are.
            </p>
            <div className="lp-final-actions">
              <motion.div
                style={{ display: 'inline-flex' }}
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link className="lp-button lp-button-light" to="/sign-up">
                  Create an Account <LandingIcon name="arrow" />
                </Link>
              </motion.div>
              <motion.div
                style={{ display: 'inline-flex' }}
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              >
                <Link className="lp-button lp-button-on-dark" to="/login">
                  Log in
                </Link>
              </motion.div>
            </div>
            <span className="lp-final-note">Explore freely. Join when it feels right.</span>
          </LandingReveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-main">
            <Link className="lp-logo" to="/" aria-label="Vegan Helper home">
              <img src="/logo.png" alt="Vegan Helper" />
            </Link>
            <p>
              Rooted in good food.<br />
              Growing together.
            </p>
            <nav aria-label="Footer navigation">
              <a href="#recipes">Recipes</a>
              <a href="#weekly-menu-preview">Weekly Menu</a>
              <a href="#stores">Vegan Stores</a>
              <a href="#community">Community</a>
            </nav>
          </div>
          <div className="lp-footer-bottom">
            <span>© {new Date().getFullYear()} Vegan Helper</span>
            <span>Made for everyday plant-based living in Vietnam.</span>
            <a href="#landing-main">Back to top ↑</a>
          </div>
        </div>
      </footer>

      <LandingAuthDialog reason={authReason} onClose={closeAuth} />
      <AIChatbot />
    </div>
  );
}
