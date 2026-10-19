import React from 'react';

const paths = {
  leaf: 'M20 4C10 2 3 6 5 14c2 7 12 6 15-10ZM5 20 15 10',
  calendar: 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Zm2 10h2m6 0h2m-10 4h2',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  plus: 'M12 5v14M5 12h14',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  bowl: 'M3 11h18c0 6-4 9-9 9s-9-3-9-9Zm4 9h10M8 3v4m4-5v5m4-4v4',
  moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z',
  target: 'M20 12a8 8 0 1 1-8-8m5-1v4h4m-4 0-5 5m4 0a4 4 0 1 1-4-4',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4',
  info: 'M12 11v6m0-10v1m10 4a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  refresh: 'M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 3M4 16l2 3a8 8 0 0 0 13-3',
};

export default function PlannerIcon({ name = 'leaf', className = '', ...props }) {
  return <svg className={`wm-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.leaf} /></svg>;
}
