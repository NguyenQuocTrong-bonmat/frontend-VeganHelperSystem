import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateTime, getTimeAgo, formatDateStr, formatCalendarDate } from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats a date-only string YYYY-MM-DD into dd/MM/yyyy without timezone shift', () => {
      expect(formatDate('2026-10-15')).toBe('15/10/2026');
      expect(formatDate('2001-03-07')).toBe('07/03/2001');
      expect(formatDate('1995-01-01')).toBe('01/01/1995');
    });

    it('formats an ISO date string with zero-time without timezone shift', () => {
      expect(formatDate('2026-10-15T00:00:00Z')).toBe('15/10/2026');
      expect(formatDate('2001-03-07T00:00:00+07:00')).toBe('07/03/2001');
    });

    it('formats a Date object or timestamp into dd/MM/yyyy', () => {
      const date = new Date(2026, 9, 15); // Month is 0-indexed: 9 = October
      expect(formatDate(date)).toBe('15/10/2026');
    });

    it('returns empty string for null, undefined or invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('formatDateTime', () => {
    it('formats a date with time as dd/MM/yyyy HH:mm', () => {
      const date = new Date(2026, 9, 15, 14, 30, 0);
      expect(formatDateTime(date)).toBe('15/10/2026 14:30');
    });

    it('includes seconds when requested', () => {
      const date = new Date(2026, 9, 15, 14, 30, 45);
      expect(formatDateTime(date, true)).toBe('15/10/2026 14:30:45');
    });

    it('returns empty string for falsy/invalid dates', () => {
      expect(formatDateTime(null)).toBe('');
      expect(formatDateTime('invalid')).toBe('');
    });
  });

  describe('formatDateStr and formatCalendarDate', () => {
    it('formatDateStr outputs dd/MM/yyyy consistently', () => {
      expect(formatDateStr('2026-10-15')).toBe('15/10/2026');
    });

    it('formatCalendarDate outputs dd/MM/yyyy', () => {
      expect(formatCalendarDate('2001-03-07')).toBe('07/03/2001');
      expect(formatCalendarDate('2001-03-07T00:00:00Z')).toBe('07/03/2001');
    });
  });

  describe('getTimeAgo', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Just now" for recent times (< 60s)', () => {
      expect(getTimeAgo('2026-10-15T11:59:45Z')).toBe('Just now');
    });

    it('returns relative minutes for < 1 hour', () => {
      expect(getTimeAgo('2026-10-15T11:45:00Z')).toBe('15 minutes ago');
    });

    it('returns relative hours for < 24 hours', () => {
      expect(getTimeAgo('2026-10-15T09:00:00Z')).toBe('3 hours ago');
    });

    it('returns relative days for 1-6 days', () => {
      expect(getTimeAgo('2026-10-13T12:00:00Z')).toBe('2 days ago');
    });

    it('falls back to dd/MM/yyyy for dates older than 7 days', () => {
      expect(getTimeAgo('2026-10-01T12:00:00Z')).toBe('01/10/2026');
    });

    it('returns empty string for falsy or invalid inputs', () => {
      expect(getTimeAgo(null)).toBe('');
      expect(getTimeAgo('invalid')).toBe('');
    });
  });
});
