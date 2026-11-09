export function trackingSummary(entries = [], now = Date.now()) {
  const elapsed = entries.filter(entry => Number.isFinite(Date.parse(entry.dueAt)) && Date.parse(entry.dueAt) <= now);
  const followed = elapsed.filter(entry => entry.status === 'followed').length;
  return { elapsed: elapsed.length, followed, notRecorded: elapsed.length - followed,
    percent: elapsed.length ? Math.round(followed / elapsed.length * 100) : null };
}

export function weekIsComplete(plan, today) {
  return Boolean(plan?.endDate && today > plan.endDate);
}
