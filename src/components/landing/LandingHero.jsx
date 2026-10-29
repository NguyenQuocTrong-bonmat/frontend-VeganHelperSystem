import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import LandingIcon from './LandingIcon';
import useLandingMedia from './useLandingMedia';
import {
  easeEditorial,
  fadeUpVariants,
  lineRevealVariants,
  springGentle,
} from './motionVariants';
import heroPho from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import heroSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';
import heroHerbs from '../../assets/images/hero/hero-herbs-cutout.png';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

export default function LandingHero() {
  const sectionRef = useRef(null);
  const mediaReducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const framerReducedMotion = useReducedMotion();
  const reducedMotion = mediaReducedMotion || Boolean(framerReducedMotion);
  const desktop = useLandingMedia('(min-width: 1024px)');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // 2.5D Parallax layers driven by scroll without state re-renders
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const foregroundRotate = useTransform(scrollYProgress, [0, 1], [-6, -1]);
  const herbsRotate = useTransform(scrollYProgress, [0, 1], [3, 10]);
  const stampRotate = useTransform(scrollYProgress, [0, 1], [12, 28]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const itemTransition = { duration: reducedMotion ? 0 : 0.8, ease: easeEditorial };

  const copyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.09,
        delayChildren: reducedMotion ? 0 : 0.05,
      },
    },
  };

  const actionGroupVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.65,
        ease: easeEditorial,
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.5, ease: easeEditorial },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="landing-hero"
      data-landing-chapter="hero"
      className="lp-section lp-section-chapter lp-hero"
      aria-labelledby="landing-hero-title"
    >
      {/* Background organic halo */}
      <div className="lp-hero-bg-halo" aria-hidden="true" />

      <div className="lp-container lp-hero-layout">
        {/* Editorial Narrative Column */}
        <motion.div
          className="lp-hero-copy"
          style={desktop && !reducedMotion ? { y: textY } : undefined}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={copyContainerVariants}
        >
          {/* Editorial Eyebrow */}
          <motion.p className="lp-eyebrow" variants={fadeUpVariants} transition={itemTransition}>
            <span />01 / The First Bite · Rooted in Vietnam
          </motion.p>

          {/* Masked Headline */}
          <h1 id="landing-hero-title">
            <span className="lp-title-mask">
              <motion.span variants={lineRevealVariants} transition={itemTransition}>
                A little greener.
              </motion.span>
            </span>
            <span className="lp-title-mask">
              <motion.span variants={lineRevealVariants} transition={itemTransition}>
                A whole lot
              </motion.span>
            </span>
            <span className="lp-title-mask">
              <motion.em variants={lineRevealVariants} transition={itemTransition}>
                more delicious.
              </motion.em>
            </span>
          </h1>

          {/* Supporting Description */}
          <motion.p
            className="lp-hero-description"
            variants={fadeUpVariants}
            transition={itemTransition}
          >
            The flavors you love. The balance you are looking for. Discover plant-based cooking, plan your week and find your people — all in one place.
          </motion.p>

          {/* CTAs with tactile interaction feedback */}
          <motion.div className="lp-hero-actions" variants={actionGroupVariants}>
            <motion.a
              href="#recipes"
              className="lp-button lp-button-primary"
              variants={buttonVariants}
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.16 }}
            >
              Explore Vegan Recipes <LandingIcon name="arrow" />
            </motion.a>
            <MotionLink
              to="/sign-up"
              className="lp-button lp-button-outline"
              variants={buttonVariants}
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.16 }}
            >
              Join the Community
            </MotionLink>
          </motion.div>

          {/* Supporting Micro-Proof Note */}
          <motion.div className="lp-hero-note" variants={fadeUpVariants} transition={itemTransition}>
            <span className="lp-mini-leaves" aria-hidden="true">
              <LandingIcon name="leaf" />
              <LandingIcon name="bowl" />
              <LandingIcon name="people" />
            </span>
            <p>
              For the curious cook.<br />
              <strong>And every kind of plant-based journey.</strong>
            </p>
          </motion.div>
        </motion.div>

        {/* Signature 2.5D "Food Beyond the Frame" Visual Stage */}
        <div className="lp-hero-stage">
          {/* Ceramic textured backdrop circle */}
          <div className="lp-hero-plate-backing" aria-hidden="true" />

          {/* Dominant Dish Layer: Pho bursting out of its frame */}
          <motion.div
            className="lp-hero-main-dish-wrap"
            style={desktop && !reducedMotion ? { y: heroY, scale: heroScale } : undefined}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.95, ease: easeEditorial }}
          >
            <div className="lp-hero-dish-frame">
              <img
                src={heroPho}
                alt="Authentic Vietnamese vegan pho with golden tofu, noodles, and aromatic herbs"
                className="lp-hero-pho-img"
                fetchpriority="high"
                loading="eager"
              />
              <div className="lp-hero-dish-tag">
                <span>COMFORT IN A BOWL</span>
                <strong>Vegan Phở Cổ Truyền</strong>
              </div>
            </div>
          </motion.div>

          {/* Foreground Supporting Layer: Summer Spring Rolls with dipping sauce */}
          <motion.div
            className="lp-hero-foreground-dish"
            style={desktop && !reducedMotion ? { y: foregroundY, rotate: foregroundRotate } : undefined}
            initial={reducedMotion ? false : { opacity: 0, x: -25, y: 30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.25, ease: easeEditorial }}
          >
            <div className="lp-hero-spring-rolls-card">
              <img
                src={heroSpringRolls}
                alt="Fresh Vietnamese vegetable spring rolls with peanut dipping sauce"
                className="lp-hero-spring-rolls-img"
                loading="eager"
              />
              <div className="lp-hero-spring-rolls-badge">
                <span>Crisp & Fresh</span>
                <strong>Gỏi Cuốn Chay</strong>
              </div>
            </div>
          </motion.div>

          {/* Foreground Fresh Herbs & Lime Accent */}
          <motion.div
            className="lp-hero-herbs-accent"
            style={desktop && !reducedMotion ? { y: foregroundY, rotate: herbsRotate } : undefined}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.88, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.3, ease: easeEditorial }}
            aria-hidden="true"
          >
            <img
              src={heroHerbs}
              alt=""
              className="lp-hero-herbs-img"
              loading="eager"
            />
          </motion.div>

          {/* Editorial Stamp */}
          <motion.div
            className="lp-hero-stamp"
            style={desktop && !reducedMotion ? { rotate: stampRotate } : undefined}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reducedMotion ? { duration: 0 } : { ...springGentle, delay: 0.35 }}
          >
            <LandingIcon name="leaf" width="24" height="24" />
            <span>ORIGINAL TASTE<br />100% PLANT-BASED</span>
          </motion.div>

          {/* Editorial Margin Notes */}
          <span className="lp-hero-vertical-meta" aria-hidden="true">
            A FRESH TAKE ON EVERYDAY LIVING
          </span>
        </div>
      </div>

      {/* Chapter 01 Bottom Settle Guide */}
      <div className="lp-hero-chapter-guide" aria-hidden="true">
        <span className="lp-hero-chapter-index">01 / 07 · DISCOVER</span>
        <div className="lp-hero-guide-line" />
        <a href="#platform" className="lp-hero-guide-prompt">
          <span>Scroll to explore platform</span>
          <span className="lp-hero-guide-arrow">↓</span>
        </a>
      </div>
    </section>
  );
}
