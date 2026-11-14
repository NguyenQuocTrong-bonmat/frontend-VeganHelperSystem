import { useId } from 'react';

export default function RecipeDifficultyFilter({ value = '', onChange, disabled = false, hint = '', variant = 'feed' }) {
  const id = useId();
  const landing = variant === 'landing';
  if (variant === 'compact') {
    return (
      <div className="min-w-0">
        <label htmlFor={id} className="mb-2 block text-sm font-semibold text-text-charcoal">Difficulty</label>
        <div className="flex min-w-0 items-center gap-1">
          <select id={id} value={value} disabled={disabled} onChange={event => onChange(event.target.value)}
            className="min-h-11 w-full min-w-0 flex-1 cursor-pointer rounded-xl border border-border-sage-mist bg-surface-paper px-3 py-2 text-base text-text-charcoal transition-colors hover:border-primary-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            <option value="">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {value && !disabled && <button type="button" onClick={() => onChange('')} aria-label="Clear difficulty filter" title="Clear difficulty filter"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-primary-moss transition-colors hover:bg-bg-herb-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss">
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
          </button>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col gap-2 rounded-2xl border p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${landing ? 'border-[var(--lp-border)] bg-[var(--lp-cream-soft)] text-[var(--lp-text)]' : 'border-vh-border bg-vh-surface text-vh-text-primary'}`}>
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold">Difficulty</label>
        <p id={`${id}-hint`} className={`mt-0.5 text-xs leading-5 ${landing ? 'text-[var(--lp-muted)]' : 'text-vh-text-secondary'}`}>
          {hint || 'Choose a cooking level, from simple to more adventurous.'}
        </p>
      </div>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <select id={id} value={value} disabled={disabled} onChange={event => onChange(event.target.value)} aria-describedby={`${id}-hint`}
          className={`min-h-12 min-w-0 flex-1 cursor-pointer rounded-xl border px-3 py-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-40 sm:flex-none ${landing ? 'border-[var(--lp-border)] bg-[var(--lp-surface)] text-[var(--lp-forest)] focus-visible:outline-[var(--lp-forest)]' : 'border-vh-border bg-white text-vh-forest focus-visible:outline-vh-forest'}`}>
          <option value="">All levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {value && !disabled && <button type="button" onClick={() => onChange('')} aria-label="Clear difficulty filter"
          className={`min-h-12 shrink-0 cursor-pointer rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${landing ? 'text-[var(--lp-forest)] hover:bg-[var(--lp-mint)] focus-visible:outline-[var(--lp-forest)]' : 'text-vh-forest hover:bg-vh-mint focus-visible:outline-vh-forest'}`}>Clear</button>}
      </div>
    </div>
  );
}
