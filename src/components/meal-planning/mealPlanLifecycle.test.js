import { describe, expect, test } from 'vitest';
import { trackingSummary, weekIsComplete } from './mealPlanLifecycle';

describe('weekly menu lifecycle', () => {
  test('finishes on day eight, not during the seventh day', () => {
    const plan = { endDate: '2026-11-08' };
    expect(weekIsComplete(plan, '2026-11-08')).toBe(false);
    expect(weekIsComplete(plan, '2026-11-09')).toBe(true);
    expect(weekIsComplete({}, '2026-11-09')).toBe(false);
  });
  test('all elapsed scheduled meals count, while future meals are excluded', () => {
    const past = '2026-11-08T00:00:00Z';
    const entries = ['followed', 'unlogged', 'changed', 'skipped'].map(status => ({ status, dueAt: past }));
    entries.push({ status: 'unlogged', dueAt: '2026-11-10T00:00:00Z' });
    expect(trackingSummary(entries, Date.parse('2026-11-09T00:00:00Z'))).toEqual({ elapsed: 4, followed: 1, notRecorded: 3, percent: 25 });
    expect(trackingSummary([])).toEqual({ elapsed: 0, followed: 0, notRecorded: 0, percent: null });
  });
});
