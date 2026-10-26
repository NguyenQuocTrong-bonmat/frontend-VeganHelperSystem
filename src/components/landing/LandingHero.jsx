import { useRef, useState } from 'react';
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

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

function HeroStage({ reducedMotion, cinematic, layers = {} }) {
  const itemTransition = { duration: reducedMotion ? 0 : 0.8, ease: easeEditorial };

  // Copy entrance orchestrator
  const copyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
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
    <div className="lp-hero-stage">
      {/* Botanical backdrop layer */}
      <motion.div
        className="lp-hero-botanical lp-hero-botanical-back"
        aria-hidden="true"
        style={layers.backLeaf}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.2, ease: easeEditorial }}
      >
        <LandingIcon name="leaf" width="400" height="400" />
      </motion.div>

      <motion.div
        className="lp-hero-mist"
        aria-hidden="true"
        style={layers.mist}
      />

      <div className="lp-container lp-hero-layout">
        {/* Editorial Copy */}
        <motion.div
          className="lp-hero-copy"
          style={layers.copy}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={copyContainerVariants}
        >
          {/* Eyebrow */}
          <motion.p className="lp-eyebrow" variants={fadeUpVariants} transition={itemTransition}>
            <span />Rooted in Vietnam. Open to everyone.
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

          {/* Staggered CTAs with refined tactile feedback */}
          <motion.div
            className="lp-hero-actions"
            variants={actionGroupVariants}
          >
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

          {/* Supporting Note */}
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

        {/* Visual Composition */}
        <motion.div
          className="lp-hero-visual"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.15, ease: easeEditorial }}
        >
          {/* Main Pho Arch */}
          <motion.div className="lp-hero-image" style={layers.image}>
            <motion.img
              src={heroPho}
              alt="Vietnamese vegan pho with golden tofu, noodles and fresh herbs"
              fetchpriority="high"
              initial={reducedMotion ? false : { scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 1.4, ease: easeEditorial }}
            />
            <motion.div
              className="lp-hero-image-caption"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.4 }}
            >
              <span>THE EVERYDAY, REIMAGINED</span>
              <strong>Comfort in a bowl.</strong>
            </motion.div>
          </motion.div>

          {/* Side Plate with subtle float */}
          <motion.div
            className="lp-hero-side-image"
            style={layers.foreground}
            initial={reducedMotion ? false : { opacity: 0, x: -16, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.28, ease: easeEditorial }}
          >
            <img src={heroSpringRolls} alt="Fresh vegetable spring rolls with dipping sauce" />
          </motion.div>

          {/* Editorial Stamp */}
          <motion.div
            className="lp-hero-stamp"
            style={layers.stamp}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={reducedMotion ? { duration: 0 } : { ...springGentle, delay: 0.35 }}
          >
            <LandingIcon name="leaf" width="28" height="28" />
            <span>GOOD FOOD.<br />GENTLER LIVING.</span>
          </motion.div>

          <span className="lp-hero-vertical" aria-hidden="true">A FRESH TAKE ON EVERYDAY LIVING</span>
          <span className="lp-hero-photo-note">Plant-based inspiration · serving suggestion</span>
        </motion.div>
      </div>

      {/* Front Botanical Leaf */}
      <motion.div
        className="lp-hero-botanical lp-hero-botanical-front"
        aria-hidden="true"
        style={layers.frontLeaf}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.2, ease: easeEditorial }}
      >
        <LandingIcon name="leaf" width="180" height="180" />
      </motion.div>

      {/* Cinematic Scroll Guide */}
      {cinematic && (
        <div className="lp-hero-scroll-guide">
          <span>01 / DISCOVER</span>
          <div className="lp-hero-scroll-line" aria-hidden="true">
            <motion.span style={{ scaleX: layers.progress }} />
          </div>
          <a href="#recipes">
            Scroll to find your flavor{' '}
            <motion.span
              aria-hidden="true"
              animate={reducedMotion ? undefined : { y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </a>
        </div>
      )}
    </div>
  );
}

function ScrollHeroStage({ sectionRef }) {
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // One progress value drives every layer. Scroll never updates React state.
  const imageY = useTransform(scrollYProgress, [0, 0.2, 1], [40, 0, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 0.22, 1], [0.95, 1, 1.08]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const frontY = useTransform(scrollYProgress, [0, 1], [14, -95]);
  const frontRotate = useTransform(scrollYProgress, [0, 1], [-10, 2]);
  const stampY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const stampRotate = useTransform(scrollYProgress, [0, 1], [12, 26]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const frontLeafY = useTransform(scrollYProgress, [0, 1], [30, -140]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.75, 0, 0]);
  const mistY = useTransform(scrollYProgress, [0, 0.18, 1], [0, -90, -90]);

  return (
    <HeroStage
      cinematic
      reducedMotion={false}
      layers={{
        progress: scrollYProgress,
        image: { y: imageY, scale: imageScale, rotate: imageRotate },
        foreground: { y: frontY, rotate: frontRotate },
        stamp: { y: stampY, rotate: stampRotate },
        copy: { y: copyY },
        backLeaf: { y: backY },
        frontLeaf: { y: frontLeafY },
        mist: { opacity: mistOpacity, y: mistY },
      }}
    />
  );
}

export default function LandingHero() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const mediaReducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const framerReducedMotion = useReducedMotion();
  const reducedMotion = mediaReducedMotion || Boolean(framerReducedMotion);
  const desktop = useLandingMedia('(min-width: 901px) and (min-height: 700px)');
  const cinematic = desktop && !reducedMotion;
  const canObserve = typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

  return (
    <motion.section
      ref={sectionRef}
      className={`lp-hero lp-hero-cinematic ${cinematic ? 'is-pinned' : ''}`}
      aria-labelledby="landing-hero-title"
      data-motion-active={!reducedMotion && visible}
      onViewportEnter={canObserve ? () => setVisible(true) : undefined}
      onViewportLeave={canObserve ? () => setVisible(false) : undefined}
      viewport={{ amount: 0.05 }}
    >
      {cinematic ? (
        <ScrollHeroStage sectionRef={sectionRef} />
      ) : (
        <HeroStage reducedMotion={reducedMotion} cinematic={false} />
      )}
    </motion.section>
  );
}
