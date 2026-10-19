import React from 'react';
import { dateLabel } from './plannerFormat';

export default function MealTrackingControl({ entry, compact, disabled, future, pending, onChange }) {
  const followed = entry.status === 'followed';
  const nextStatus = followed ? 'unlogged' : 'followed';
  const nextLabel = followed ? 'not recorded' : 'followed';
  return <div className={`wm-meal-tracking ${compact ? 'is-compact' : ''}`} aria-busy={pending}>
    <button type="button" className="wm-follow-button" aria-pressed={followed} disabled={disabled || future}
      onClick={() => onChange(nextStatus)} aria-label={`Mark ${entry.mealTime} as ${nextLabel} on ${dateLabel(entry.date)}`}>
      {pending ? 'Saving…' : followed ? 'Followed' : 'Not recorded'}
    </button>
  </div>;
}
