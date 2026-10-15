export function notificationTarget(value) {
  // All current BE targets are internal routes; never navigate to arbitrary push URLs.
  return typeof value === 'string' && /^(\/posts\/(edit\/)?[1-9]\d*|\/users\/[1-9]\d*|\/weekly-menu)$/.test(value)
    ? value : '/home';
}
