import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import LandingIcon from './LandingIcon';
import LandingReveal from './LandingReveal';
import useLandingMedia from './useLandingMedia';

const pillars = [
  { icon: 'bowl', number: '01', label: 'Discover', title: 'A world of plant-based flavor.', description: 'Discover cooking ideas, familiar Vietnamese flavors and new favorites from community kitchens.', link: 'Explore recipes', href: '#recipes' },
  { icon: 'pin', number: '02', label: 'Explore', title: 'Find your local green spots.', description: 'Get to know vegan kitchens and stores, and make everyday plant-based choices a little easier.', link: 'Discover stores', href: '#stores' },
  { icon: 'calendar', number: '03', label: 'Plan', title: 'A week made around you.', description: 'Bring your health profile, allergies and calorie target into a varied seven-day menu.', link: 'Meet your weekly menu', href: '#weekly-menu-preview' },
  { icon: 'people', number: '04', label: 'Connect', title: 'Better with good company.', description: 'Share what you cook, follow inspiring creators and learn from people on the same journey.', link: 'Find your community', href: '#community' },
];

function PillarHeading() {
  return <><p className="lp-eyebrow"><span />More than a recipe collection</p><h2 id="landing-pillars-title">Everything you need.<br /><em>A little more connected.</em></h2><p>Good food is just the beginning. Build everyday habits with tools and people that belong together.</p></>;
}

function ReelCard({ pillar, index, progress, onFocus }) {
  const opacity = useTransform(progress, value => 1 - Math.min(1, Math.abs(value * 3 - index)) * 0.53);
  const scale = useTransform(progress, value => 1 - Math.min(1, Math.abs(value * 3 - index)) * 0.07);
  const iconX = useTransform(progress, value => (value * 3 - index) * -13);
  const iconRotate = useTransform(progress, value => (value * 3 - index) * 4);
  return <motion.article className={`lp-reel-card lp-reel-card-${index}`} style={{ opacity, scale }} data-pillar-index={index} onFocusCapture={onFocus}>
    <div className="lp-reel-art" aria-hidden="true"><span className="lp-reel-orbit lp-reel-orbit-one" /><span className="lp-reel-orbit lp-reel-orbit-two" /><motion.span style={{ x: iconX, rotate: iconRotate }}><LandingIcon name={pillar.icon} width="85" height="85" /></motion.span><span className="lp-reel-art-label">{pillar.number} / {pillar.label}</span></div>
    <div className="lp-reel-card-copy"><h3>{pillar.title}</h3><p>{pillar.description}</p><a href={pillar.href}>{pillar.link}<LandingIcon name="arrow" width="18" height="18" /></a></div>
  </motion.article>;
}

function PillarReel({ sectionRef }) {
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const countRef = useRef(null);
  const stepRefs = useRef([]);
  const nearestRef = useRef(0);
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 0, 1, 1]);
  const x = useTransform(progress, value => -value * travel);
  const { scrollYProgress: passage } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const stageY = useTransform(passage, [0, 0.22, 0.78, 1], [60, 0, 0, -60]);

  useLayoutEffect(() => {
    const measure = () => {
      const card = trackRef.current?.querySelector('.lp-reel-card');
      if (card) setTravel((card.offsetWidth + 24) * (pillars.length - 1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, 'change', value => {
    const nearest = Math.round(value * (pillars.length - 1));
    if (nearest === nearestRef.current) return;
    nearestRef.current = nearest;
    if (countRef.current) countRef.current.textContent = `0${nearest + 1}`;
    stepRefs.current.forEach((button, index) => {
      if (index === nearest) button?.setAttribute('aria-current', 'step');
      else button?.removeAttribute('aria-current');
    });
  });

  const showCard = (index, smooth = true) => {
    const section = sectionRef.current;
    const start = window.scrollY + section.getBoundingClientRect().top;
    const sceneProgress = index === 0 ? 0 : index === pillars.length - 1 ? 1 : 0.04 + (index / (pillars.length - 1)) * 0.92;
    window.scrollTo({ top: start + sceneProgress * (section.offsetHeight - window.innerHeight), behavior: smooth ? 'smooth' : 'instant' });
  };

  return <div className="lp-pillar-sticky"><motion.div className="lp-container lp-pillar-stage" style={{ y: stageY }}>
    <div className="lp-pillar-reel-intro"><PillarHeading /><div className="lp-reel-readout" aria-hidden="true"><span ref={countRef}>01</span><span>/ 04</span><div><motion.span style={{ scaleX: progress }} /></div></div><p className="lp-reel-help">Scroll to explore, or choose a chapter.</p><div className="lp-reel-steps" role="group" aria-label="Choose a platform feature">{pillars.map((pillar, index) => <button type="button" key={pillar.number} ref={node => { stepRefs.current[index] = node; }} aria-current={index === 0 ? 'step' : undefined} aria-label={`Show ${pillar.label.toLowerCase()} feature`} onClick={() => showCard(index)}>{pillar.number}</button>)}</div></div>
    <div ref={frameRef} className="lp-pillar-window"><motion.div ref={trackRef} className="lp-pillar-track" style={{ x }}>{pillars.map((pillar, index) => <ReelCard key={pillar.number} pillar={pillar} index={index} progress={progress} onFocus={() => showCard(index, false)} />)}</motion.div></div>
  </motion.div></div>;
}

export default function LandingPillars() {
  const sectionRef = useRef(null);
  const desktop = useLandingMedia('(min-width: 901px) and (min-height: 700px)');
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const cinematic = desktop && !reducedMotion;
  return <section id="platform" data-landing-chapter="platform" ref={sectionRef} className={`lp-section lp-pillars lp-pillars-cinematic ${cinematic ? 'is-pinned' : ''}`} aria-labelledby="landing-pillars-title">
    {cinematic ? <PillarReel sectionRef={sectionRef} /> : <div className="lp-container"><LandingReveal className="lp-pillars-heading"><PillarHeading /></LandingReveal><div className="lp-pillar-grid">{pillars.map((pillar, index) => <LandingReveal as="article" className="lp-pillar" key={pillar.number} delay={index * 0.06}><div className="lp-pillar-top"><LandingIcon name={pillar.icon} width="30" height="30" /><span>{pillar.number}</span></div><h3>{pillar.title}</h3><p>{pillar.description}</p><a href={pillar.href}>{pillar.link}<LandingIcon name="arrow" width="18" height="18" /></a></LandingReveal>)}</div></div>}
  </section>;
}
