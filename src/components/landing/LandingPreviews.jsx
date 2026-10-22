import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import LandingIcon from './LandingIcon';
import LandingReveal from './LandingReveal';
import LandingWeekRoute from './LandingWeekRoute';

const sampleWeek = [
  ['Mon', 'Overnight oats', 'Lemongrass tofu bowl', 'Mushroom pho'],
  ['Tue', 'Avocado toast', 'Fresh spring rolls', 'Coconut vegetable curry'],
  ['Wed', 'Chia & mango pudding', 'Chickpea salad', 'Ginger tofu noodles'],
  ['Thu', 'Banana oatmeal', 'Sesame tempeh bowl', 'Pumpkin soup'],
  ['Fri', 'Sweet potato bowl', 'Vegetable banh mi', 'Lotus root stir-fry'],
  ['Sat', 'Coconut rice porridge', 'Mushroom rice bowl', 'Vegetable hotpot'],
  ['Sun', 'Fruit & granola', 'Turmeric noodles', 'Stuffed bell peppers'],
];

export function WeeklyMenuPreview({ onAuthRequired }) {
  const sectionRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const reducedMotion = useReducedMotion();
  return <section ref={sectionRef} id="weekly-menu-preview" data-landing-chapter="weekly-menu-preview" className="lp-section lp-weekly" aria-labelledby="landing-weekly-title">
    <div className="lp-container">
      <LandingReveal className="lp-weekly-intro">
        <div><p className="lp-eyebrow"><span />A little planning. A lot more living.</p><h2 id="landing-weekly-title">Your week,<br />with one less <em>what if.</em></h2></div>
        <div className="lp-weekly-description"><p>Less time wondering what to eat. More time enjoying it. Build a week around your health profile, dietary preferences, declared allergies and estimated calorie target.</p><button type="button" className="lp-text-link" onClick={() => onAuthRequired('Create an account or log in to build a weekly menu using your health profile, allergies and calorie target.')}>Create Your Weekly Menu <LandingIcon name="arrow" /></button></div>
      </LandingReveal>
      <LandingWeekRoute sectionRef={sectionRef} />
      <LandingReveal className="lp-calendar-shell" depth delay={0.06}>
        <div className="lp-calendar-toolbar"><div className="lp-calendar-title"><span className="lp-calendar-icon"><LandingIcon name="calendar" /></span><div><strong>A good week starts here.</strong><span>Sample vegan menu · 7 days · 3 meals a day</span></div></div><span className="lp-preview-badge">Interactive preview</span></div>
        <div className="lp-calendar-context"><span><LandingIcon name="leaf" width="15" height="15" /> Plant-based variety</span><span>Health profile</span><span>Declared allergies</span><span>Calorie target</span></div>
        <div className="lp-calendar-days" role="group" aria-label="Preview a day in the sample menu">{sampleWeek.map(([day], index) => <button key={day} type="button" aria-pressed={selectedDay === index} className={selectedDay === index ? 'is-selected' : ''} onClick={() => setSelectedDay(index)}>{selectedDay === index && <motion.span className="lp-calendar-day-selection" aria-hidden="true" layoutId={reducedMotion ? undefined : 'landing-calendar-selected-day'} transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}<span>{day}</span><strong>{String(index + 1).padStart(2, '0')}</strong></button>)}</div>
        <div className="lp-calendar-grid" aria-label="Sample weekly menu">
          {['Breakfast', 'Lunch', 'Dinner'].map((mealTime, row) => <div className="lp-calendar-row" key={mealTime}>
            {sampleWeek.map(([day, ...meals], column) => <div key={day} className={`lp-calendar-meal ${selectedDay === column ? 'is-selected' : ''}`}><span className="lp-meal-time"><span />{mealTime}</span><strong>{meals[row]}</strong><LandingIcon name={row === 0 ? 'leaf' : 'bowl'} width="18" height="18" /></div>)}
          </div>)}
        </div>
        <div className="lp-calendar-mobile" aria-live="polite">{['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => <div key={meal}><span className="lp-meal-time">{meal}</span><motion.strong key={`${selectedDay}-${meal}`} initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.24 }}>{sampleWeek[selectedDay][index + 1]}</motion.strong><LandingIcon name="bowl" /></div>)}</div>
        <div className="lp-calendar-footer"><p><LandingIcon name="check" width="16" height="16" /> One dish per meal. A fresh idea every day.</p><span>Illustrative menu, not a personalized plan</span></div>
      </LandingReveal>
      <div className="lp-weekly-footnote"><p>Your preferences come first. Tell us about allergies such as soy, nuts or gluten-containing ingredients before generating a menu.</p><p>Calorie targets are estimates. Always check ingredients and product labels.</p></div>
    </div>
  </section>;
}

const mapSpots = [
  { name: 'Plant-based kitchens', description: 'Find a new favorite lunch spot.', icon: 'bowl', x: 36, y: 36 },
  { name: 'Fresh produce', description: 'Discover ingredients close to home.', icon: 'leaf', x: 64, y: 61 },
  { name: 'Pantry essentials', description: 'Make room for everyday staples.', icon: 'pin', x: 72, y: 27 },
];

export function VeganStorePreview({ onAuthRequired }) {
  const [selected, setSelected] = useState(0);
  const reducedMotion = useReducedMotion();
  return <section id="stores" data-landing-chapter="stores" className="lp-section lp-stores" aria-labelledby="landing-stores-title"><div className="lp-container lp-stores-layout">
    <LandingReveal className="lp-stores-copy"><p className="lp-eyebrow"><span />Good things, closer to home</p><h2 id="landing-stores-title">Your next favorite<br />spot is out there.</h2><p>From neighborhood vegan kitchens to everyday ingredients, discover the plant-based side of Ho Chi Minh City.</p>
      <div className="lp-store-list" role="group" aria-label="Explore store categories">{mapSpots.map((spot, index) => <button type="button" key={spot.name} className={selected === index ? 'is-selected' : ''} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="lp-store-icon"><LandingIcon name={spot.icon} /></span><span><strong>{spot.name}</strong><small>{spot.description}</small></span><span className="lp-store-number">0{index + 1}</span></button>)}</div>
      <button type="button" className="lp-button lp-button-primary" onClick={() => onAuthRequired('Our store directory currently requires a login. Sign in to browse store information and find places near you.')}>Find Stores Near You <LandingIcon name="arrow" /></button>
    </LandingReveal>
    <LandingReveal className="lp-map-preview" depth delay={0.08} aria-label="Illustrated store discovery preview">
      <svg className="lp-map-art" viewBox="0 0 720 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="720" height="620" fill="#e9eee4" />
        <g fill="#dce5d3"><path d="M30 30h170v130H30zM350 30h135v110H350zM60 300h150v100H60zM280 360h135v180H280zM510 210h130v160H510zM540 470h150v120H540z" /><circle cx="300" cy="225" r="54" /><circle cx="120" cy="500" r="63" /></g>
        <path d="M670-50C410 80 680 220 430 330S510 500 390 680" fill="none" stroke="#c3d9d8" strokeWidth="68" />
        <g fill="none" stroke="#fbfcf9" strokeWidth="18"><path d="M-20 190 740 60M-20 450 740 320M175-20 320 660M410-20 530 640M-20 580 760 480" /><path d="M-20 280 300 225 740 240M50-20 80 230 10 660" strokeWidth="10" /></g>
        <g fill="none" stroke="#d7cdb0" strokeWidth="3"><path d="M-20 190 740 60M175-20 320 660M-20 450 740 320" /></g>
        <g fontFamily="DM Sans, sans-serif" fontSize="13" letterSpacing="3" fill="#7b8977"><text x="88" y="103">HO CHI MINH CITY</text><text x="45" y="552" fontSize="10">EXPLORE YOUR NEIGHBORHOOD</text></g>
      </svg>
      <div className="lp-map-caption"><span className="lp-live-dot" /> A greener neighborhood</div>
      {mapSpots.map((spot, index) => <button key={spot.name} type="button" className={`lp-map-pin ${selected === index ? 'is-selected' : ''}`} style={{ left: `${spot.x}%`, top: `${spot.y}%` }} aria-label={`Highlight ${spot.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><LandingIcon name={spot.icon} /></button>)}
      <div className="lp-map-location" aria-live="polite"><motion.div className="lp-map-location-content" key={selected} initial={reducedMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : 0.24 }}><span className="lp-store-icon"><LandingIcon name={mapSpots[selected].icon} /></span><div><strong>{mapSpots[selected].name}</strong><span>{mapSpots[selected].description}</span></div></motion.div></div>
      <span className="lp-map-disclaimer">Illustrated area · not a live map or verified store locations</span>
    </LandingReveal>
  </div></section>;
}
