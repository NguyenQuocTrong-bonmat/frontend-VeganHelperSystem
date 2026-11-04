import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LandingIcon from './LandingIcon';
import LandingReveal from './LandingReveal';
import { easeEditorial } from './motionVariants';
import heroSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';

const pillars = [
  {
    number: '01',
    label: 'Recipes',
    title: 'A world of plant-based flavor.',
    description: 'Explore curated culinary recipes, familiar Vietnamese flavors and creative favorites from home kitchens across the country.',
    link: 'Explore recipes',
    href: '#recipes',
    tag: 'Community Kitchen',
  },
  {
    number: '02',
    label: 'Vegan Stores',
    title: 'Find your local green spots.',
    description: 'Discover nearby vegan restaurants, organic markets and plant-based ingredient shops in your neighborhood.',
    link: 'Discover stores',
    href: '#stores',
    tag: 'Local Map',
  },
  {
    number: '03',
    label: 'Weekly Menu',
    title: 'A week made around you.',
    description: 'Harmonize your health profile, declared allergies, and nutrition targets into an effortless, balanced 7-day meal plan.',
    link: 'Meet your weekly menu',
    href: '#weekly-menu-preview',
    tag: 'Smart Planning',
  },
  {
    number: '04',
    label: 'Community',
    title: 'Better with good company.',
    description: 'Share what you cook, follow inspiring creators, exchange tips and grow together with people on the same lifestyle journey.',
    link: 'Find your community',
    href: '#community',
    tag: 'Shared Table',
  },
];

export default function LandingPillars() {
  const [activePillar, setActivePillar] = useState(0);
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="platform"
      data-landing-chapter="platform"
      className="lp-section lp-section-chapter lp-platform"
      aria-labelledby="landing-pillars-title"
    >
      <div className="lp-container lp-platform-container">
        {/* Editorial Section Header */}
        <LandingReveal className="lp-platform-heading">
          <div className="lp-platform-heading-copy">
            <p className="lp-eyebrow">
              <span />02 / More than a recipe collection
            </p>
            <h2 id="landing-pillars-title">
              Everything you need.<br />
              <em>A little more connected.</em>
            </h2>
            <p className="lp-platform-subtitle">
              Good food is just the beginning. Build everyday habits with tools, local spots, and people that belong together.
            </p>
          </div>

          <div className="lp-platform-pagers" role="group" aria-label="Platform pillars navigation">
            {pillars.map((p, idx) => (
              <button
                key={p.number}
                type="button"
                className={`lp-pillar-step-btn ${activePillar === idx ? 'is-active' : ''}`}
                aria-current={activePillar === idx ? 'step' : undefined}
                aria-label={`Highlight feature ${p.number}: ${p.label}`}
                onClick={() => setActivePillar(idx)}
              >
                <span>{p.number}</span>
                <span className="lp-step-name">{p.label}</span>
              </button>
            ))}
          </div>
        </LandingReveal>

        {/* Asymmetrical Editorial Composition */}
        <div className="lp-platform-editorial-grid">
          {/* Dominant Hero Feature Box (Left) */}
          <LandingReveal as="article" className="lp-platform-hero-card" delay={0.05}>
            <div className="lp-hero-card-media" aria-hidden="true">
              <img
                src={heroSpringRolls}
                alt="Plant-based ingredients and dishes"
                className="lp-hero-card-img"
                loading="lazy"
              />
              <div className="lp-hero-card-overlay" />
            </div>

            <div className="lp-hero-card-content">
              <div className="lp-hero-card-tag">
                <LandingIcon name="bowl" width="20" height="20" />
                <span>{pillars[0].tag} · 01</span>
              </div>
              <h3>{pillars[0].title}</h3>
              <p>{pillars[0].description}</p>
              <a href={pillars[0].href} className="lp-hero-card-cta">
                <span>{pillars[0].link}</span>
                <LandingIcon name="arrow" width="18" height="18" />
              </a>
            </div>
          </LandingReveal>

          {/* Staggered Secondary Pillars (Right Stack) */}
          <div className="lp-platform-secondary-stack">
            {pillars.slice(1).map((pillar, index) => {
              const actualIdx = index + 1;
              const isSelected = activePillar === actualIdx;
              return (
                <LandingReveal key={pillar.number} delay={0.06 + index * 0.06}>
                  <motion.article
                    className={`lp-pillar-tile ${isSelected ? 'is-highlighted' : ''}`}
                    whileHover={reducedMotion ? undefined : { y: -3, transition: { duration: 0.2, ease: easeEditorial } }}
                    onClick={() => setActivePillar(actualIdx)}
                  >
                    <div className="lp-pillar-tile-top">
                      <span className="lp-pillar-tile-num">{pillar.number}</span>
                      <span className="lp-pillar-tile-tag">{pillar.tag}</span>
                      <LandingIcon
                        name={actualIdx === 1 ? 'pin' : actualIdx === 2 ? 'calendar' : 'people'}
                        width="22"
                        height="22"
                      />
                    </div>

                    <h3 className="lp-pillar-tile-title">{pillar.title}</h3>
                    <p className="lp-pillar-tile-desc">{pillar.description}</p>

                    <a href={pillar.href} className="lp-pillar-tile-link">
                      <span>{pillar.link}</span>
                      <LandingIcon name="arrow" width="16" height="16" />
                    </a>
                  </motion.article>
                </LandingReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
