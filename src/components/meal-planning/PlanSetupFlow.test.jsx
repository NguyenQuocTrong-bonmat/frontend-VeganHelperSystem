import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from '../../lib/axios';
import PlanSetupFlow from './PlanSetupFlow';

describe('PlanSetupFlow - Validation & TDEE UX (Phase 4)', () => {
  let container, root, originalAdapter, profileMock, goalPreviewMock;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
    global.IS_REACT_ACT_ENVIRONMENT = true;

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    originalAdapter = axios.defaults.adapter;
    profileMock = {
      heightCm: 170,
      weightKg: 65,
      birthDate: '1995-05-15',
      biologicalSex: 'female',
      activityLevel: 'moderate',
      dietType: 'vegan',
      allergies: [],
    };
    goalPreviewMock = {
      allowed: true,
      tdee: 2100,
      targetCalories: 1850,
      dailyAdjustment: -250,
      reasons: [],
    };

    axios.defaults.adapter = vi.fn(async config => {
      if (config.url === '/HealthProfile') {
        return { data: profileMock, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (config.url === '/MealPlans/goal-preview') {
        return { data: goalPreviewMock, status: 200, statusText: 'OK', headers: {}, config };
      }
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    axios.defaults.adapter = originalAdapter;
    vi.useRealTimers();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      busy: false,
      onGenerate: vi.fn(),
      onCancel: vi.fn(),
      onEditProfile: vi.fn(),
      error: '',
      profileRevision: 0,
      ...props,
    };
    return act(async () => {
      root.render(<PlanSetupFlow {...defaultProps} />);
    });
  };

  const button = text =>
    [...container.querySelectorAll('button')].find(
      node => node.textContent.includes(text) || node.getAttribute('aria-label')?.includes(text)
    );

  const click = node => act(async () => node.click());

  const change = (node, value) =>
    act(async () => {
      Object.getOwnPropertyDescriptor(
        node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype,
        'value'
      ).set.call(node, value);
      node.dispatchEvent(new Event('change', { bubbles: true }));
    });

  const submit = () =>
    act(async () => {
      container.querySelector('#plan-setup-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

  it('1. required fields show inline errors when left empty or blank', async () => {
    await renderComponent();

    // Step 0 -> Step 1
    await submit();

    // 1a. Menu name empty
    await change(container.querySelector('#meal-plan-name'), '');
    await submit();
    const nameError = container.querySelector('#meal-plan-name-error');
    expect(nameError).not.toBeNull();
    expect(nameError.textContent).toBe('Enter a name for this weekly menu.');

    // 1b. Start date empty
    await change(container.querySelector('#meal-plan-start'), '');
    await submit();
    const startError = container.querySelector('#start-date-error');
    expect(startError).not.toBeNull();
    expect(startError.textContent).toBe('Choose a start date for your weekly menu.');

    // Switch to weight-goal to check weight goal fields
    await click(button('Back'));
    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    // 1c. Target weight empty
    await submit();
    const weightError = container.querySelector('#goal-weight-error');
    expect(weightError).not.toBeNull();
    expect(weightError.textContent).toBe('Enter your target weight.');

    // 1d. Eligibility unchecked
    const eligError = container.querySelector('#goal-eligibility-error');
    expect(eligError).not.toBeNull();
    expect(eligError.textContent).toBe('Confirm that you meet the age and health criteria for a weight goal plan.');
  });

  it('2. invalid values show inline errors in the correct position', async () => {
    await renderComponent();

    // Advance to step 1 (balanced mode)
    await submit();

    // 2a. Meal split total not 100%
    await change(container.querySelector('#meal-split-breakfast'), '20');
    await change(container.querySelector('#meal-split-lunch'), '30');
    await change(container.querySelector('#meal-split-dinner'), '40'); // Sum = 90%
    await submit();
    const splitError = container.querySelector('#meal-split-error');
    expect(splitError).not.toBeNull();
    expect(splitError.textContent).toBe(
      'Adjust the shares for breakfast, lunch and dinner so each is between 1% and 98% and the total is 100%.'
    );

    // Switch to weight-goal
    await click(button('Back'));
    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    // 2b. Target weight < 30 kg
    await change(container.querySelector('#goal-weight'), '25');
    await submit();
    const weightErrorLow = container.querySelector('#goal-weight-error');
    expect(weightErrorLow).not.toBeNull();
    expect(weightErrorLow.textContent).toBe('Choose a target weight between 30 and 200 kg.');

    // Target weight > 200 kg
    await change(container.querySelector('#goal-weight'), '220');
    await submit();
    const weightErrorHigh = container.querySelector('#goal-weight-error');
    expect(weightErrorHigh).not.toBeNull();
    expect(weightErrorHigh.textContent).toBe('Choose a target weight between 30 and 200 kg.');

    // 2c. Target date less than 7 days from start date
    await change(container.querySelector('#meal-plan-start'), '2026-10-21');
    await change(container.querySelector('#goal-date'), '2026-10-24'); // 3 days
    await submit();
    const dateErrorShort = container.querySelector('#goal-date-error');
    expect(dateErrorShort).not.toBeNull();
    expect(dateErrorShort.textContent).toContain('at least 7 days after your start date');

    // 2d. Target date > 730 days
    await change(container.querySelector('#goal-date'), '2029-01-01');
    await submit();
    const dateErrorLong = container.querySelector('#goal-date-error');
    expect(dateErrorLong).not.toBeNull();
    expect(dateErrorLong.textContent).toContain('smaller first milestone');
  });

  it('3. Continue is disabled and submit is blocked when form data is invalid', async () => {
    await renderComponent();

    // Step 0 -> Step 1
    await submit();

    // Empty menu name
    await change(container.querySelector('#meal-plan-name'), '');
    const continueBtn = container.querySelector('button[type="submit"]');
    expect(continueBtn.disabled).toBe(true);

    // Attempting submit does not advance to step 2
    await submit();
    expect(container.querySelector('.wm-review')).toBeNull();
    expect(container.querySelector('#meal-plan-name')).not.toBeNull();
  });

  it('4. fixing invalid values updates validation state in real time and enables Continue', async () => {
    await renderComponent();

    // Step 0 -> Step 1 (balanced mode)
    await submit();

    // Make split invalid
    await change(container.querySelector('#meal-split-breakfast'), '10');
    expect(container.querySelector('button[type="submit"]').disabled).toBe(true);

    // Fix split to 100%
    await change(container.querySelector('#meal-split-breakfast'), '25');
    expect(container.querySelector('#meal-split-error')).toBeNull();
    expect(container.querySelector('button[type="submit"]').disabled).toBe(false);

    // Submitting advances to step 2
    await submit();
    expect(container.querySelector('.wm-review')).not.toBeNull();
  });

  it('5. user data is preserved across steps and after validation failure', async () => {
    await renderComponent();

    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    // Enter custom data
    await change(container.querySelector('#meal-plan-name'), 'My Personal Journey');
    await change(container.querySelector('#meal-plan-start'), '2026-10-25');
    await change(container.querySelector('#goal-weight'), '58');
    await change(container.querySelector('#goal-date'), '2026-12-30');
    await click(container.querySelector('#goal-eligibility'));

    // Trigger validation error on split
    await change(container.querySelector('#meal-split-dinner'), '10');
    await submit();

    // Data is still present
    expect(container.querySelector('#meal-plan-name').value).toBe('My Personal Journey');
    expect(container.querySelector('#goal-weight').value).toBe('58');
    expect(container.querySelector('#goal-eligibility').checked).toBe(true);

    // Fix split and advance to Review
    await change(container.querySelector('#meal-split-dinner'), '45');
    await submit();
    expect(container.textContent).toContain('My Personal Journey');
    expect(container.textContent).toContain('58 kg');

    // Go back to Step 1
    await click(button('Back'));
    expect(container.querySelector('#meal-plan-name').value).toBe('My Personal Journey');
    expect(container.querySelector('#goal-weight').value).toBe('58');
    expect(container.querySelector('#goal-eligibility').checked).toBe(true);
  });

  it('6. invalid health profile / TDEE blocks plan creation and does not call onGenerate', async () => {
    const onGenerate = vi.fn();
    profileMock = {
      heightCm: 50, // invalid (< 100)
      weightKg: 20, // invalid (< 30)
      dietType: 'vegan',
    };

    await renderComponent({ onGenerate });

    // Step 0 -> Step 1 -> Step 2
    await submit();
    await submit();

    expect(container.querySelector('.wm-review')).not.toBeNull();
    expect(container.textContent).toContain('Check the height in your health profile');
    expect(container.querySelector('button[type="submit"]').disabled).toBe(true);

    await submit();
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('7. rejected safety validation does not call onGenerate and preserves user inputs', async () => {
    const onGenerate = vi.fn();
    goalPreviewMock = {
      allowed: false,
      reasons: ['Losing this much by your target date would require cutting calories too sharply, which could leave you tired or low on energy. Choose a later target date to give yourself more time.'],
    };

    await renderComponent({ onGenerate });

    // Weight goal mode
    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    await change(container.querySelector('#goal-weight'), '60');
    await change(container.querySelector('#goal-date'), '2026-11-15');
    await click(container.querySelector('#goal-eligibility'));
    await submit();

    // On Step 2: Click Check goal safety
    expect(container.querySelector('button[type="submit"]').textContent).toContain('Check goal safety');
    await submit();

    // Safety failed: returned to Step 1 with guidance
    expect(container.textContent).toContain('cutting calories too sharply');
    expect(container.querySelector('#goal-weight').value).toBe('60');
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it('8. staged weight loss guidance is displayed for overweight profile with non-loss target', async () => {
    profileMock = {
      heightCm: 170,
      weightKg: 85, // BMI ~ 29.4 (overweight)
      birthDate: '1990-01-01',
      biologicalSex: 'female',
      activityLevel: 'moderate',
      dietType: 'vegan',
    };

    await renderComponent();
    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    // Target weight >= current weight (85kg)
    await change(container.querySelector('#goal-weight'), '88');
    expect(container.textContent).toContain('the planner supports gradual weight loss');

    // Target weight underweight (target BMI < 18.5)
    await change(container.querySelector('#goal-weight'), '40');
    expect(container.textContent).toContain('would put your estimated BMI below 18.5');
  });

  it('9. target date enforces minimum 7 days rule', async () => {
    await renderComponent();
    await click(container.querySelector('input[value="weight-goal"]'));
    await submit();

    await change(container.querySelector('#meal-plan-start'), '2026-10-21');
    await change(container.querySelector('#goal-weight'), '60');
    await click(container.querySelector('#goal-eligibility'));

    // 4 days after start date
    await change(container.querySelector('#goal-date'), '2026-10-25');
    await submit();
    expect(container.querySelector('#goal-date-error')).not.toBeNull();
    expect(container.querySelector('#goal-date-error').textContent).toContain('at least 7 days after your start date');

    // Exactly 7 days after start date
    await change(container.querySelector('#goal-date'), '2026-10-28');
    expect(container.querySelector('#goal-date-error')).toBeNull();
    expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
  });
});

