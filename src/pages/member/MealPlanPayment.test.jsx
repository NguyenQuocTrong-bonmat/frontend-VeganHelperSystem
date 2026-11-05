import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, test, vi } from 'vitest';
import MealPlanPayment from './MealPlanPayment';
import {
  createMealPlanCheckout,
  getMealPlanAccess,
  getMealPlanPackages,
} from '../../services/mealPlanPaymentService';
import { MEAL_PLAN_CHECKOUT_CONTEXT_KEY } from '../../utils/mealPlanPaymentContext';

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => <header data-testid="mock-header" /> }));
vi.mock('../../components/layout/Footer', () => ({ default: () => <footer data-testid="mock-footer" /> }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => <div data-testid="mock-chatbot" /> }));

vi.mock('../../services/mealPlanPaymentService', () => ({
  createMealPlanCheckout: vi.fn(),
  getMealPlanAccess: vi.fn(),
  getMealPlanPackages: vi.fn(),
}));

let container, root;

const mockPackages = [
  { code: 'one-month', name: 'One Month', durationMonths: 1, amountVnd: 49000 },
  { code: 'three-months', name: 'Three Months', durationMonths: 3, amountVnd: 129000 },
  { code: 'six-months', name: 'Six Months', durationMonths: 6, amountVnd: 239000 },
];

const mockAccess = {
  status: 'active',
  canGenerate: true,
  canViewExistingPlans: true,
  canViewTrialPlans: true,
  expiresAt: '2027-06-01T00:00:00Z',
  graceEndsAt: '2027-06-08T00:00:00Z',
  trialGenerationsRemaining: 3,
};

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);

  sessionStorage.clear();
  vi.clearAllMocks();

  getMealPlanAccess.mockResolvedValue(mockAccess);
  getMealPlanPackages.mockResolvedValue(mockPackages);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

const render = () => act(async () => {
  root.render(
    <MemoryRouter initialEntries={['/meal-plans/payment']}>
      <MealPlanPayment />
    </MemoryRouter>
  );
});

test('renders payment page with header, packages and current access status', async () => {
  await render();

  expect(container.textContent).toContain('Choose Your Meal Plan Package');
  expect(container.textContent).toContain('Your current membership');
  expect(container.textContent).toContain('Active');
  expect(container.textContent).toContain('One Month');
  expect(container.textContent).toContain('Three Months');
  expect(container.textContent).toContain('Six Months');
  expect(container.querySelector('a[href="/weekly-menu"]')).not.toBeNull();
});

test('defaults selection to first package and allows selecting another package', async () => {
  await render();

  const radioInputs = container.querySelectorAll('input[type="radio"]');
  expect(radioInputs.length).toBe(3);
  expect(radioInputs[0].checked).toBe(true);

  // Select second package
  await act(async () => {
    radioInputs[1].click();
  });

  expect(radioInputs[0].checked).toBe(false);
  expect(radioInputs[1].checked).toBe(true);
  expect(container.textContent).toContain('Selected: Three Months');
});

test('initiating checkout calls createMealPlanCheckout, saves context and redirects to checkoutUrl', async () => {
  const assignSpy = vi.fn();
  delete window.location;
  window.location = { assign: assignSpy };

  createMealPlanCheckout.mockResolvedValue({
    orderId: 99,
    orderCode: 990099,
    checkoutUrl: 'https://pay.payos.vn/web/test-checkout-99',
  });

  await render();

  const checkoutBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Proceed to PayOS Checkout'));
  expect(checkoutBtn).not.toBeNull();

  await act(async () => {
    checkoutBtn.click();
  });

  expect(createMealPlanCheckout).toHaveBeenCalledWith('one-month');

  // Verify context saved in sessionStorage
  const savedContext = JSON.parse(sessionStorage.getItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY));
  expect(savedContext).toEqual({ orderId: 99, orderCode: 990099 });

  // Verify redirect
  expect(assignSpy).toHaveBeenCalledWith('https://pay.payos.vn/web/test-checkout-99');
});

test('displays error message when checkout creation fails', async () => {
  createMealPlanCheckout.mockRejectedValue(new Error('PayOS gateway is temporarily unavailable'));

  await render();

  const checkoutBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Proceed to PayOS Checkout'));

  await act(async () => {
    checkoutBtn.click();
  });

  expect(createMealPlanCheckout).toHaveBeenCalledWith('one-month');
  expect(container.textContent).toContain('PayOS gateway is temporarily unavailable');
});

test('rejects insecure checkout URL and displays an error', async () => {
  createMealPlanCheckout.mockResolvedValue({
    orderId: 99,
    orderCode: 990099,
    checkoutUrl: 'http://insecure-checkout.example.com',
  });

  await render();

  const checkoutBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Proceed to PayOS Checkout'));

  await act(async () => {
    checkoutBtn.click();
  });

  expect(container.textContent).toContain('The payment link is not secure');
});

test('displays error message when packages fail to load and allows retry', async () => {
  getMealPlanPackages.mockRejectedValueOnce(new Error('Network error loading packages'));

  await render();

  expect(container.textContent).toContain('Network error loading packages');

  // Mock recovery
  getMealPlanPackages.mockResolvedValueOnce(mockPackages);

  const retryBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Try loading packages again'));
  expect(retryBtn).not.toBeNull();

  await act(async () => {
    retryBtn.click();
  });

  expect(container.textContent).toContain('One Month');
});
