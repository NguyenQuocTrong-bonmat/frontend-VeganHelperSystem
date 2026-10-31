/**
 * Formats a date into DD/MM/YYYY format (e.g., "15/10/2026").
 * Safe against timezone shifts for date-only strings (YYYY-MM-DD).
 * @param {string|number|Date} dateInput - The date to format
 * @returns {string} Formatted date string in DD/MM/YYYY
 */
export function formatDate(dateInput) {
  if (!dateInput && dateInput !== 0) return '';

  // Handle date-only or zero-time calendar strings without timezone shift
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return '';

    // Already DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return trimmed;
    }

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s]00:00:00(?:\.0+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.exec(trimmed);
    if (dateOnlyMatch) {
      return `${dateOnlyMatch[3]}/${dateOnlyMatch[2]}/${dateOnlyMatch[1]}`;
    }
  }

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Explicit alias for formatDate to emphasize DD/MM/YYYY standard.
 */
export const formatDateDMY = formatDate;

/**
 * Formats a date and time into DD/MM/YYYY HH:mm format (e.g., "15/10/2026 14:30").
 * Preserves time information where required.
 * @param {string|number|Date} dateInput
 * @param {boolean} [includeSeconds=false]
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateInput, includeSeconds = false) {
  if (!dateInput && dateInput !== 0) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (includeSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Explicit alias for formatDateTime.
 */
export const formatDateTimeDMY = formatDateTime;

/**
 * Validates whether a string is a complete and valid calendar date in DD/MM/YYYY format.
 * Correctly accounts for month lengths, leap years, and boundaries.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidDateDMY(value) {
  if (!value || typeof value !== 'string') return false;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (year < 1000 || year > 9999 || month < 1 || month > 12) return false;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return day >= 1 && day <= daysInMonth;
}

/**
 * Parses a DD/MM/YYYY date string into an ISO date-only string (YYYY-MM-DD) for API submission.
 * Also safely accepts YYYY-MM-DD input for normalization.
 * Returns empty string for invalid dates.
 * @param {string} value
 * @returns {string} YYYY-MM-DD or empty string
 */
export function parseDateDMY(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();

  // Allow already formatted ISO date-only strings (YYYY-MM-DD)
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    if (year < 1000 || year > 9999 || month < 1 || month > 12) return '';
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return day >= 1 && day <= daysInMonth ? `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}` : '';
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) return '';

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  if (year < 1000 || year > 9999 || month < 1 || month > 12) return '';
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) return '';

  return `${yearText}-${monthText}-${dayText}`;
}

/**
 * Converts a Date object, timestamp, DD/MM/YYYY, or ISO string to YYYY-MM-DD for API submission.
 * Preserves the exact calendar date without timezone shift.
 * @param {string|number|Date} value
 * @returns {string} YYYY-MM-DD or empty string
 */
export function toISODateOnly(value) {
  if (!value && value !== 0) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      return parseDateDMY(trimmed);
    }
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Masks user input for live typing in a DD/MM/YYYY field.
 * Automatically inserts slashes after day and month.
 * Also handles pasted YYYY-MM-DD gracefully.
 * @param {string} value
 * @returns {string}
 */
export function formatDateInput(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();

  // Handle pasted ISO date
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const digits = trimmed.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Converts a date string into a relative time string (e.g., "5 minutes ago", "2 hours ago")
 * Falls back to DD/MM/YYYY for dates older than 7 days.
 * @param {string|Date} dateString - The date to convert
 * @returns {string} Relative time or formatted date string
 */
export function getTimeAgo(dateString) {
  if (!dateString && dateString !== 0) return '';

  const date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMs = now - date;

  if (diffMs < 0) {
    return 'Just now';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return formatDate(date);
  }
}

/**
 * Formats a date into DD/MM/YYYY format (e.g., "15/10/2026")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateStr(dateString) {
  return formatDate(dateString);
}

// Format a calendar date without converting timezones (birth dates are date-only).
export function formatCalendarDate(value) {
  if (!value && value !== 0) return '';
  return formatDate(value);
}

