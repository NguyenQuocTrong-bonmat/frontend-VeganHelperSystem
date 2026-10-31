import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateDMY,
  formatDateTime,
  formatDateTimeDMY,
  getTimeAgo,
  formatDateStr,
  formatCalendarDate,
  isValidDateDMY,
  parseDateDMY,
  toISODateOnly,
  formatDateInput,
} from './dateUtils';

describe('dateUtils', () => {
  describe('formatDate and formatDateDMY', () => {
    it('formats specified test dates into DD/MM/YYYY without timezone shift', () => {
      expect(formatDate('2006-11-10')).toBe('10/11/2006');
      expect(formatDate('2000-01-05')).toBe('05/01/2000');
      expect(formatDate('2026-12-21')).toBe('21/12/2026');
      expect(formatDateDMY('2006-11-10')).toBe('10/11/2006');
    });

    it('formats a date-only string YYYY-MM-DD into DD/MM/YYYY without timezone shift', () => {
      expect(formatDate('2026-10-15')).toBe('15/10/2026');
      expect(formatDate('2001-03-07')).toBe('07/03/2001');
      expect(formatDate('1995-01-01')).toBe('01/01/1995');
    });

    it('formats an ISO date string with zero-time without timezone shift', () => {
      expect(formatDate('2026-10-15T00:00:00Z')).toBe('15/10/2026');
      expect(formatDate('2001-03-07T00:00:00+07:00')).toBe('07/03/2001');
    });

    it('formats a Date object or timestamp into DD/MM/YYYY', () => {
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

  describe('formatDateTime and formatDateTimeDMY', () => {
    it('formats a date with time as DD/MM/YYYY HH:mm preserving hours and minutes', () => {
      const date = new Date(2026, 9, 15, 14, 30, 0);
      expect(formatDateTime(date)).toBe('15/10/2026 14:30');
      expect(formatDateTimeDMY(date)).toBe('15/10/2026 14:30');
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

  describe('isValidDateDMY', () => {
    it('validates complete calendar dates correctly', () => {
      expect(isValidDateDMY('10/11/2006')).toBe(true);
      expect(isValidDateDMY('05/01/2000')).toBe(true);
      expect(isValidDateDMY('21/12/2026')).toBe(true);
    });

    it('rejects invalid calendar dates like 31/02/2006', () => {
      expect(isValidDateDMY('31/02/2006')).toBe(false);
      expect(isValidDateDMY('29/02/2006')).toBe(false); // 2006 is not leap year
    });

    it('handles leap years correctly', () => {
      expect(isValidDateDMY('29/02/2024')).toBe(true); // 2024 is leap year
      expect(isValidDateDMY('29/02/2023')).toBe(false); // 2023 is not leap year
      expect(isValidDateDMY('29/02/2000')).toBe(true); // 2000 is leap year (divisible by 400)
      expect(isValidDateDMY('29/02/1900')).toBe(false); // 1900 is not leap year (century not div by 400)
    });

    it('handles valid and invalid dates on month boundaries', () => {
      expect(isValidDateDMY('31/01/2026')).toBe(true);
      expect(isValidDateDMY('30/04/2026')).toBe(true);
      expect(isValidDateDMY('31/04/2026')).toBe(false); // April has 30 days
      expect(isValidDateDMY('31/06/2026')).toBe(false); // June has 30 days
      expect(isValidDateDMY('30/09/2026')).toBe(true);
      expect(isValidDateDMY('31/09/2026')).toBe(false); // September has 30 days
      expect(isValidDateDMY('30/11/2026')).toBe(true);
      expect(isValidDateDMY('31/11/2026')).toBe(false); // November has 30 days
    });

    it('rejects incomplete, empty, or malformed values', () => {
      expect(isValidDateDMY('')).toBe(false);
      expect(isValidDateDMY(null)).toBe(false);
      expect(isValidDateDMY('10/11')).toBe(false);
      expect(isValidDateDMY('10/11/06')).toBe(false);
      expect(isValidDateDMY('2006-11-10')).toBe(false); // Not DMY
      expect(isValidDateDMY('32/01/2026')).toBe(false);
      expect(isValidDateDMY('00/01/2026')).toBe(false);
      expect(isValidDateDMY('15/13/2026')).toBe(false);
    });
  });

  describe('parseDateDMY and toISODateOnly', () => {
    it('parses DD/MM/YYYY into YYYY-MM-DD for API submission', () => {
      expect(parseDateDMY('10/11/2006')).toBe('2006-11-10');
      expect(parseDateDMY('05/01/2000')).toBe('2000-01-05');
      expect(parseDateDMY('21/12/2026')).toBe('2026-12-21');
    });

    it('returns empty string for invalid dates in parseDateDMY', () => {
      expect(parseDateDMY('31/02/2006')).toBe('');
      expect(parseDateDMY('incomplete')).toBe('');
      expect(parseDateDMY(null)).toBe('');
    });

    it('normalizes YYYY-MM-DD in parseDateDMY', () => {
      expect(parseDateDMY('2006-11-10')).toBe('2006-11-10');
      expect(parseDateDMY('2006-02-31')).toBe('');
    });

    it('toISODateOnly converts various date formats without shifting calendar day', () => {
      expect(toISODateOnly('10/11/2006')).toBe('2006-11-10');
      expect(toISODateOnly('2006-11-10')).toBe('2006-11-10');
      expect(toISODateOnly('2006-11-10T00:00:00Z')).toBe('2006-11-10');
      expect(toISODateOnly(new Date(2006, 10, 10))).toBe('2006-11-10');
      expect(toISODateOnly(null)).toBe('');
    });
  });

  describe('formatDateInput (live mask)', () => {
    it('masks digits into DD/MM/YYYY format with slashes', () => {
      expect(formatDateInput('1')).toBe('1');
      expect(formatDateInput('10')).toBe('10');
      expect(formatDateInput('101')).toBe('10/1');
      expect(formatDateInput('1011')).toBe('10/11');
      expect(formatDateInput('10112')).toBe('10/11/2');
      expect(formatDateInput('10112006')).toBe('10/11/2006');
    });

    it('converts pasted ISO date string YYYY-MM-DD into DD/MM/YYYY', () => {
      expect(formatDateInput('2006-11-10')).toBe('10/11/2006');
      expect(formatDateInput('2026-12-21')).toBe('21/12/2026');
    });
  });

  describe('formatDateStr and formatCalendarDate', () => {
    it('formatDateStr outputs DD/MM/YYYY consistently', () => {
      expect(formatDateStr('2026-10-15')).toBe('15/10/2026');
    });

    it('formatCalendarDate outputs DD/MM/YYYY without timezone shift', () => {
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

    it('falls back to DD/MM/YYYY for dates older than 7 days', () => {
      expect(getTimeAgo('2026-10-01T12:00:00Z')).toBe('01/10/2026');
    });

    it('returns empty string for falsy or invalid inputs', () => {
      expect(getTimeAgo(null)).toBe('');
      expect(getTimeAgo('invalid')).toBe('');
    });
  });
});
