import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AccountSuspended from './AccountSuspended';

describe('AccountSuspended Component', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('displays the exact reason provided by the backend response', async () => {
    const specificReason = 'Violated community guidelines by posting unverified medical claims regarding nutrition.';
    
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[{ pathname: '/account-suspended', state: { reason: specificReason } }]}>
          <Routes>
            <Route path="/account-suspended" element={<AccountSuspended />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Check heading and status message
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Account Suspended');
    expect(container.textContent).toContain('Your account has been suspended.');
    expect(container.textContent).toContain('Reason for suspension');

    // Check exact reason display
    const reasonEl = container.querySelector('[data-testid="ban-reason-text"]');
    expect(reasonEl).not.toBeNull();
    expect(reasonEl.textContent).toBe(specificReason);
  });

  it('displays a safe generic restriction message when reason is missing or empty without fabricating details', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[{ pathname: '/account-suspended', state: {} }]}>
          <Routes>
            <Route path="/account-suspended" element={<AccountSuspended />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const heading = container.querySelector('h1');
    expect(heading.textContent).toBe('Account Suspended');

    // Does not show specific reason text
    const specificReasonEl = container.querySelector('[data-testid="ban-reason-text"]');
    expect(specificReasonEl).toBeNull();

    // Shows safe fallback
    const fallbackEl = container.querySelector('[data-testid="ban-reason-fallback"]');
    expect(fallbackEl).not.toBeNull();
    expect(fallbackEl.textContent).toContain('No specific reason was provided');
    expect(fallbackEl.textContent).toContain('Your account has been suspended by an administrator.');
  });

  it('renders correctly in inline mode (embedded inside Login card) with callback', async () => {
    const onBackMock = vi.fn();
    const inlineReason = 'Repeated spam promotion in recipe comments.';

    await act(async () => {
      root.render(
        <MemoryRouter>
          <AccountSuspended isInline={true} reason={inlineReason} onBackToLogin={onBackMock} />
        </MemoryRouter>
      );
    });

    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Account Suspended');

    const reasonEl = container.querySelector('[data-testid="ban-reason-text"]');
    expect(reasonEl).not.toBeNull();
    expect(reasonEl.textContent).toBe(inlineReason);

    // Click back to login button
    const backBtn = container.querySelector('[data-testid="back-to-login-btn"]');
    expect(backBtn).not.toBeNull();
    expect(backBtn.textContent).toContain('Back to Log In');

    await act(async () => {
      backBtn.click();
    });
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('provides a valid support contact link', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/account-suspended']}>
          <Routes>
            <Route path="/account-suspended" element={<AccountSuspended />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const mailLink = container.querySelector('a[href^="mailto:"]');
    expect(mailLink).not.toBeNull();
    expect(mailLink.getAttribute('href')).toContain('support@botanicalhearth.com');
  });
});
