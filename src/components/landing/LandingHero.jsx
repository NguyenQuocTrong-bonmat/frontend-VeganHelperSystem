import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import LandingIcon from './LandingIcon';
import useLandingMedia from './useLandingMedia';
import heroPho from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import heroSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';

const ease = [0.22, 1, 0.36, 1];
const entrance = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
const lineEntrance = { hidden: { y: '110%' }, visible: { y: '0%' } };

function HeroStage({ reducedMotion, cinematic, layers = {} }) {
  const itemTransition = { duration: reducedMotion ? 0 : 0.8, ease };
  return <div className="lp-hero-stage">
    <motion.div className="lp-hero-botanical lp-hero-botanical-back" aria-hidden="true" style={layers.backLeaf}><LandingIcon name="leaf" width="400" height="400" /></motion.div>
    <motion.div className="lp-hero-mist" aria-hidden="true" style={layers.mist} />
    <div className="lp-container lp-hero-layout">
      <motion.div className="lp-hero-copy" style={layers.copy} initial={reducedMotion ? false : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.11 } } }}>
        <motion.p className="lp-eyebrow" variants={entrance} transition={itemTransition}><span />Rooted in Vietnam. Open to everyone.</motion.p>
        <h1 id="landing-hero-title">
          <span className="lp-title-mask"><motion.span variants={lineEntrance} transition={itemTransition}>A little greener.</motion.span></span>
          <span className="lp-title-mask"><motion.span variants={lineEntrance} transition={itemTransition}>A whole lot</motion.span></span>
          <span className="lp-title-mask"><motion.em variants={lineEntrance} transition={itemTransition}>more delicious.</motion.em></span>
        </h1>
        <motion.p className="lp-hero-description" variants={entrance} transition={itemTransition}>The flavors you love. The balance you are looking for. Discover plant-based cooking, plan your week and find your people — all in one place.</motion.p>
        <motion.div className="lp-hero-actions" variants={entrance} transition={itemTransition}>
          <a href="#recipes" className="lp-button lp-button-primary">Explore Vegan Recipes <LandingIcon name="arrow" /></a>
          <Link to="/sign-up" className="lp-button lp-button-outline">Join the Community</Link>
        </motion.div>
        <motion.div className="lp-hero-note" variants={entrance} transition={itemTransition}><span className="lp-mini-leaves"><LandingIcon name="leaf" /><LandingIcon name="bowl" /><LandingIcon name="people" /></span><p>For the curious cook.<br /><strong>And every kind of plant-based journey.</strong></p></motion.div>
      </motion.div>
      <motion.div className="lp-hero-visual" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.16, ease }}>
        <motion.div className="lp-hero-image" style={layers.image}>
          <motion.img src={heroPho} alt="Vietnamese vegan pho with golden tofu, noodles and fresh herbs" fetchpriority="high" initial={reducedMotion ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: reducedMotion ? 0 : 1.5, ease }} />
          <div className="lp-hero-image-caption"><span>THE EVERYDAY, REIMAGINED</span><strong>Comfort in a bowl.</strong></div>
        </motion.div>
        <motion.div className="lp-hero-side-image" style={layers.foreground}><img src={heroSpringRolls} alt="Fresh vegetable spring rolls with dipping sauce" /></motion.div>
        <motion.div className="lp-hero-stamp" style={layers.stamp}><LandingIcon name="leaf" width="28" height="28" /><span>GOOD FOOD.<br />GENTLER LIVING.</span></motion.div>
        <span className="lp-hero-vertical">A FRESH TAKE ON EVERYDAY LIVING</span>
        <span className="lp-hero-photo-note">Plant-based inspiration · serving suggestion</span>
      </motion.div>
    </div>
    <motion.div className="lp-hero-botanical lp-hero-botanical-front" aria-hidden="true" style={layers.frontLeaf}><LandingIcon name="leaf" width="180" height="180" /></motion.div>
    {cinematic && <div className="lp-hero-scroll-guide"><span>01 / DISCOVER</span><div className="lp-hero-scroll-line" aria-hidden="true"><motion.span style={{ scaleX: layers.progress }} /></div><a href="#recipes">Scroll to find your flavor <span aria-hidden="true">↓</span></a></div>}
  </div>;
}

function ScrollHeroStage({ sectionRef }) {
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // One progress value drives every layer. Scroll never updates React state.
  const imageY = useTransform(scrollYProgress, [0, 0.2, 1], [48, 0, -32]);
  const imageScale = useTransform(scrollYProgress, [0, 0.22, 1], [0.94, 1, 1.09]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const frontY = useTransform(scrollYProgress, [0, 1], [18, -110]);
  const frontRotate = useTransform(scrollYProgress, [0, 1], [-12, 2]);
  const stampY = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const stampRotate = useTransform(scrollYProgress, [0, 1], [12, 28]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const frontLeafY = useTransform(scrollYProgress, [0, 1], [35, -160]);
  const mistOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.75, 0, 0]);
  const mistY = useTransform(scrollYProgress, [0, 0.18, 1], [0, -100, -100]);

  return <HeroStage cinematic reducedMotion={false} layers={{
    progress: scrollYProgress,
    image: { y: imageY, scale: imageScale, rotate: imageRotate },
    foreground: { y: frontY, rotate: frontRotate },
    stamp: { y: stampY, rotate: stampRotate },
    copy: { y: copyY }, backLeaf: { y: backY },
    frontLeaf: { y: frontLeafY }, mist: { opacity: mistOpacity, y: mistY },
  }} />;
}

export default function LandingHero() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const desktop = useLandingMedia('(min-width: 901px) and (min-height: 700px)');
  const cinematic = desktop && !reducedMotion;
  const canObserve = typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

  return <motion.section ref={sectionRef} className={`lp-hero lp-hero-cinematic ${cinematic ? 'is-pinned' : ''}`} aria-labelledby="landing-hero-title" data-motion-active={!reducedMotion && visible} onViewportEnter={canObserve ? () => setVisible(true) : undefined} onViewportLeave={canObserve ? () => setVisible(false) : undefined} viewport={{ amount: 0.05 }}>
    {cinematic ? <ScrollHeroStage sectionRef={sectionRef} /> : <HeroStage reducedMotion={reducedMotion} cinematic={false} />}
  </motion.section>;
}
