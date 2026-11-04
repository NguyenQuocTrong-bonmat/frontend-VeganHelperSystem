import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { navigateHomeAndRefresh } from './navigationUtils';

describe('navigateHomeAndRefresh', () => {
  const originalLocation = window.location;
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    delete window.location;
    window.location = {
      pathname: '/home',
      search: '',
      hash: '',
      reload: vi.fn(),
      href: 'http://localhost/home'
    };
    window.scrollTo = vi.fn();
    window.history.scrollRestoration = 'auto';
  });

  afterEach(() => {
    window.location = originalLocation;
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('scrolls to top and calls window.location.reload() when already on target URL without query params', () => {
    const preventDefault = vi.fn();
    const event = { preventDefault, button: 0 };

    window.location.pathname = '/home';
    window.location.search = '';
    window.location.hash = '';

    navigateHomeAndRefresh(event, '/home');

    expect(preventDefault).toHaveBeenCalled();
    expect(window.history.scrollRestoration).toBe('manual');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('scrolls to top and sets window.location.href when navigating from another page', () => {
    const preventDefault = vi.fn();
    const event = { preventDefault, button: 0 };

    window.location.pathname = '/profile';
    window.location.search = '';

    navigateHomeAndRefresh(event, '/home');

    expect(preventDefault).toHaveBeenCalled();
    expect(window.history.scrollRestoration).toBe('manual');
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
    expect(window.location.href).toBe('/home');
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('sets window.location.href when already on target URL but with query params or hash', () => {
    const preventDefault = vi.fn();
    const event = { preventDefault, button: 0 };

    window.location.pathname = '/home';
    window.location.search = '?category=2';

    navigateHomeAndRefresh(event, '/home');

    expect(preventDefault).toHaveBeenCalled();
    expect(window.location.href).toBe('/home');
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('respects modified clicks (metaKey, ctrlKey, etc.) and does not prevent default or navigate', () => {
    const preventDefault = vi.fn();
    const event = { preventDefault, ctrlKey: true, button: 0 };

    navigateHomeAndRefresh(event, '/home');

    expect(preventDefault).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
