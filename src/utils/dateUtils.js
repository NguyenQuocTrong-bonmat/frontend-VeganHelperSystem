/**
 * Formats a date into dd/MM/yyyy format (e.g., "15/10/2026")
 * Safe against timezone shifts for date-only strings (YYYY-MM-DD).
 * @param {string|number|Date} dateInput - The date to format
 * @returns {string} Formatted date string in dd/MM/yyyy
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';

  // Handle date-only or zero-time calendar strings without timezone shift
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s]00:00:00(?:\.0+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.exec(trimmed);
    if (dateOnlyMatch) {
      return `${dateOnlyMatch[3]}/${dateOnlyMatch[2]}/${dateOnlyMatch[1]}`;
    }
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats a date and time into dd/MM/yyyy HH:mm format (e.g., "15/10/2026 14:30")
 * Preserves time information where required.
 * @param {string|number|Date} dateInput
 * @param {boolean} [includeSeconds=false]
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateInput, includeSeconds = false) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
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
 * Converts a date string into a relative time string (e.g., "5 minutes ago", "2 hours ago")
 * Falls back to dd/MM/yyyy for dates older than 7 days.
 * @param {string|Date} dateString - The date to convert
 * @returns {string} Relative time or formatted date string
 */
export function getTimeAgo(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
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
 * Formats a date into dd/MM/yyyy format (e.g., "15/10/2026")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date string
 */
export function formatDateStr(dateString) {
  return formatDate(dateString);
}

// Format a calendar date without converting timezones (birth dates are date-only).
export function formatCalendarDate(value) {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : formatDate(value);
}

