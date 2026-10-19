import { formatDate } from '../../utils/dateUtils';

export const number = value => value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
export const dateLabel = value => value ? formatDate(value) : 'Unknown date';
export const utcToday = () => new Date().toISOString().slice(0, 10);
export const zonedToday = zone => {
  try { return new Intl.DateTimeFormat('en-CA', { timeZone: zone || 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  catch { return utcToday(); }
};
export const weekday = (value, short = false) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: short ? 'short' : 'long', timeZone: 'UTC' });
export const rangeLabel = plan => `${dateLabel(plan.startDate)} – ${dateLabel(plan.endDate)}`;
export const dietLabel = value => value === 'vegan' ? 'Vegan' : ['lacto_ovo', 'lacto_ovo_vegetarian', 'lacto-ovo', 'vegetarian'].includes(value) ? 'Lacto-ovo vegetarian' : value ? value.replaceAll('_', ' ') : 'Not set';
