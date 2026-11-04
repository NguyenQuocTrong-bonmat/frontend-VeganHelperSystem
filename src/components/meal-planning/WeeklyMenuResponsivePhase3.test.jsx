import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PlanSetupFlow from './PlanSetupFlow';
import axios from '../../lib/axios';

describe('Phase 3 Weekly Menu Responsive Elements', () => {
  let container;
  let root;
  let originalAdapter;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    originalAdapter = axios.defaults.adapter;
    axios.defaults.adapter = vi.fn(async () => ({
      data: { heightCm: 170, weightKg: 65, dietType: 'vegan', allergies: [] },
      status: 200,
      headers: {},
      config: {},
    }));
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    axios.defaults.adapter = originalAdapter;
  });

  it('renders both full steps ol and compact progress indicator with correct structure for step 1', async () => {
    await act(async () => {
      root.render(
        <PlanSetupFlow
          profileRevision={0}
          busy={false}
          error=""
          onGenerate={() => {}}
          onCancel={() => {}}
          onEditProfile={() => {}}
        />
      );
    });

    // 1. Full steps ol check
    const fullSteps = container.querySelector('ol.wm-steps');
    expect(fullSteps).toBeTruthy();
    expect(fullSteps.querySelectorAll('li')).toHaveLength(3);
    expect(fullSteps.textContent).toContain('Your approach');
    expect(fullSteps.textContent).toContain('Your schedule');
    expect(fullSteps.textContent).toContain('Review & create');

    // 2. Compact steps indicator check
    const compactSteps = container.querySelector('.wm-steps-compact');
    expect(compactSteps).toBeTruthy();
    expect(compactSteps.querySelector('.wm-steps-compact-badge').textContent).toBe('Step 1 of 3');
    expect(compactSteps.querySelector('.wm-steps-compact-title').textContent).toBe('Your approach');

    const progressBar = compactSteps.querySelector('[role="progressbar"]');
    expect(progressBar).toBeTruthy();
    expect(progressBar.getAttribute('aria-valuenow')).toBe('1');
    expect(progressBar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressBar.getAttribute('aria-valuemax')).toBe('3');

    const progressFill = compactSteps.querySelector('.wm-steps-compact-fill');
    expect(progressFill).toBeTruthy();
    expect(progressFill.style.width).toMatch(/33\.33/);
  });

  it('renders setup footer with secondary action and primary submit action', async () => {
    await act(async () => {
      root.render(
        <PlanSetupFlow
          profileRevision={0}
          busy={false}
          error=""
          onGenerate={() => {}}
          onCancel={() => {}}
          onEditProfile={() => {}}
        />
      );
    });

    const footer = container.querySelector('.wm-setup-footer');
    expect(footer).toBeTruthy();

    const secondaryBtn = footer.querySelector('button.wm-text-button');
    expect(secondaryBtn).toBeTruthy();
    expect(secondaryBtn.textContent).toContain('Cancel setup');

    const primaryBtn = footer.querySelector('button.wm-button-primary');
    expect(primaryBtn).toBeTruthy();
    expect(primaryBtn.textContent).toContain('Continue');
  });
});
