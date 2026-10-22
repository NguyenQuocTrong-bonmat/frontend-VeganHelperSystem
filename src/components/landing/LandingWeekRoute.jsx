import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import useLandingMedia from './useLandingMedia';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const ROUTE_START_X = 40;
const ROUTE_END_X = 960;
const ROUTE_WIDTH = ROUTE_END_X - ROUTE_START_X; // 920
const ROUTE_Y = 32;
const PAUSE_PER_DAY_MS = 250; // 0.25s pause at each day stop
const TRANSIT_DURATION_SEC = 0.32; // smooth glide between adjacent days

export default function LandingWeekRoute({ sectionRef }) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const mediaReducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const framerReducedMotion = useReducedMotion();
  const systemReducedMotion = mediaReducedMotion || Boolean(framerReducedMotion);
  const [progress, setProgress] = useState(systemReducedMotion ? 1 : 0);

  // Safe, responsive intersection observer that resets when leaving and replays upon return
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(Boolean(entry?.isIntersecting));
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation controller: step-by-step day traversal with ~0.5s pauses
  useEffect(() => {
    if (systemReducedMotion) {
      setProgress(1);
      return undefined;
    }

    if (!isInView) {
      // Reset when leaving so animation replays upon returning
      setProgress(0);
      return undefined;
    }

    let isCancelled = false;
    let timerId = null;
    let currentAnimation = null;

    const wait = (ms) =>
      new Promise((resolve) => {
        timerId = setTimeout(resolve, ms);
      });

    const runSequence = async () => {
      setProgress(0);

      // Brief pause at Monday (day 0) so the initial stop is clearly visible
      await wait(PAUSE_PER_DAY_MS);
      if (isCancelled) return;

      // Sequentially glide to each day (1 to 6 = TUE to SUN) and pause 0.25s at each
      for (let step = 1; step <= 6; step++) {
        if (isCancelled) return;

        const startP = (step - 1) / 6;
        const targetP = step / 6;

        await new Promise((resolve) => {
          currentAnimation = animate(startP, targetP, {
            duration: TRANSIT_DURATION_SEC,
            ease: [0.25, 1, 0.5, 1],
            onUpdate: (latest) => {
              if (!isCancelled) {
                setProgress(latest);
              }
            },
            onComplete: () => {
              if (!isCancelled) {
                setProgress(targetP);
              }
              resolve();
            },
          });
        });

        if (isCancelled) return;

        // Pause for ~0.25s at each day before moving to the next
        if (step < 6) {
          await wait(PAUSE_PER_DAY_MS);
          if (isCancelled) return;
        }
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
      if (currentAnimation) currentAnimation.stop();
    };
  }, [isInView, systemReducedMotion]);

  const p = systemReducedMotion ? 1 : progress;
  const currentEndX = ROUTE_START_X + p * ROUTE_WIDTH;

  return (
    <div ref={containerRef} className="lp-week-route-shell w-full" aria-hidden="true">
      <svg className="lp-week-route" viewBox="0 0 1000 80">
        {/* Background dotted line */}
        <path
          d={`M${ROUTE_START_X} ${ROUTE_Y}H${ROUTE_END_X}`}
          fill="none"
          stroke="#dce3d5"
          strokeWidth="2"
          strokeDasharray="4 7"
        />

        {/* Animated green route line drawing from Monday towards Sunday */}
        {p > 0 && (
          <path
            d={`M${ROUTE_START_X} ${ROUTE_Y}H${currentEndX}`}
            fill="none"
            stroke="#2f5233"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Day stops that light up one by one as the green line & leaf pass */}
        {DAYS.map((day, index) => {
          const dotX = ROUTE_START_X + index * (ROUTE_WIDTH / 6);
          const threshold = index / 6;
          const isLit = p >= threshold - 0.015;

          return (
            <g key={day} className="lp-day-stop">
              <circle
                cx={dotX}
                cy={ROUTE_Y}
                r={isLit ? 5.5 : 4.5}
                fill="#2f5233"
                opacity={isLit ? 1 : 0.25}
                style={{ transition: 'opacity 0.2s ease, r 0.2s ease' }}
              />
              <text
                x={dotX}
                y="65"
                textAnchor="middle"
                style={{
                  fill: isLit ? '#2f5233' : 'var(--lp-muted, #8A9080)',
                  fontWeight: isLit ? '600' : '400',
                  opacity: isLit ? 1 : 0.65,
                  transition: 'fill 0.2s ease, opacity 0.2s ease',
                }}
              >
                {day}
              </text>
            </g>
          );
        })}

        {/* Gliding leaf indicator riding from Monday to Sunday */}
        <g transform={`translate(${currentEndX}, 0)`}>
          <circle cy={ROUTE_Y} r="12" fill="#eaf0e9" stroke="#2f5233" strokeWidth="1.2" />
          <path
            d="M-5 34c0-6 6-8 10-7 1 6-4 10-9 9m-2 3 8-9"
            stroke="#2f5233"
            fill="none"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
