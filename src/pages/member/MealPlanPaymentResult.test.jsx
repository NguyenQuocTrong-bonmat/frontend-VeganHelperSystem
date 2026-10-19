import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, test, vi } from 'vitest';
import MealPlanPaymentResult from './MealPlanPaymentResult';
import { MEAL_PLAN_CHECKOUT_CONTEXT_KEY } from '../../utils/mealPlanPaymentContext';
import { getMealPlanAccess, getMealPlanPaymentOrder } from '../../services/mealPlanPaymentService';

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => null }));
vi.mock('../../components/layout/Footer', () => ({ default: () => null }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));
vi.mock('../../services/mealPlanPaymentService', () => ({
  getMealPlanAccess: vi.fn(),
  getMealPlanPaymentOrder: vi.fn(),
}));

let container, root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.setItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY, JSON.stringify({ orderId: 73, orderCode: 830073 }));
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  getMealPlanAccess.mockResolvedValue({ expiresAt: '2027-01-01T00:00:00Z' });
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  sessionStorage.clear();
  vi.clearAllMocks();
});

const render = (path, variant) => act(async () => root.render(
  <MemoryRouter initialEntries={[path]}><MealPlanPaymentResult variant={variant} /></MemoryRouter>,
));

test('shows success only after the backend order endpoint confirms paid', async () => {
  getMealPlanPaymentOrder.mockResolvedValue({
    orderId: 73, packageName: 'Six months', amountVnd: 500000, status: 'paid',
  });
  await render('/meal-plans/payment/success?status=PENDING&orderCode=830073', 'success');

  expect(getMealPlanPaymentOrder).toHaveBeenCalledWith(73);
  expect(container.textContent).toContain('Payment confirmed');
  expect(container.textContent).toContain('Six months');
  expect(getMealPlanAccess).toHaveBeenCalled();
});

test('does not trust PayOS query status when the backend still reports pending', async () => {
  getMealPlanPaymentOrder.mockResolvedValue({
    orderId: 73, packageName: 'Six months', amountVnd: 500000, status: 'pending',
  });
  await render('/meal-plans/payment/cancel?status=PAID&orderCode=830073', 'cancel');

  expect(container.textContent).toContain('Payment cancelled');
  expect(container.textContent).not.toContain('Payment confirmed');
  expect(getMealPlanAccess).not.toHaveBeenCalled();
});

test('shows the failed state only when the backend order is failed', async () => {
  getMealPlanPaymentOrder.mockResolvedValue({
    orderId: 73, packageName: 'Six months', amountVnd: 500000, status: 'failed',
  });
  await render('/meal-plans/payment/failed?orderCode=830073', 'failed');

  expect(container.textContent).toContain('Payment not completed');
  expect(container.textContent).toContain('Order status');
});

test('shows recovery guidance when no matching checkout exists in this browser tab', async () => {
  sessionStorage.removeItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY);
  await render('/meal-plans/payment/success?orderCode=830073', 'success');

  expect(container.textContent).toContain('couldn’t match this return');
  expect(getMealPlanPaymentOrder).not.toHaveBeenCalled();
});
