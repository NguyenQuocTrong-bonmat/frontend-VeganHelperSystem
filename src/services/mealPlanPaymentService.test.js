import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import axios from '../lib/axios';
import {
  createMealPlanCheckout,
  getMealPlanAccess,
  getMealPlanPackages,
  getMealPlanPaymentOrder,
} from './mealPlanPaymentService';

describe('mealPlanPaymentService', () => {
  let originalAdapter;
  let adapter;

  beforeEach(() => {
    originalAdapter = axios.defaults.adapter;
    adapter = vi.fn(async config => ({ data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }));
    axios.defaults.adapter = adapter;
  });

  afterEach(() => { axios.defaults.adapter = originalAdapter; });

  test('loads packages and current access from the payment API', async () => {
    await getMealPlanPackages();
    await getMealPlanAccess();

    expect(adapter.mock.calls.map(([config]) => config.url)).toEqual([
      '/meal-plan-payments/packages',
      '/meal-plan-payments/access',
    ]);
  });

  test('creates checkout using the selected package code', async () => {
    await createMealPlanCheckout('six-month');
    const request = adapter.mock.calls[0][0];

    expect(request.url).toBe('/meal-plan-payments/checkout');
    expect(request.method).toBe('post');
    expect(JSON.parse(request.data)).toEqual({ packageCode: 'six-month' });
  });

  test('loads an order by its local order ID and forwards abort signals', async () => {
    const controller = new AbortController();
    await getMealPlanPaymentOrder(73, controller.signal);

    expect(adapter.mock.calls[0][0]).toMatchObject({
      url: '/meal-plan-payments/orders/73',
      signal: controller.signal,
    });
  });

  test('preserves API error message, status, and business error code', async () => {
    axios.defaults.adapter = async config => {
      const error = new Error('Request failed');
      error.config = config;
      error.response = { status: 402, data: { error: 'Trial limit reached.', errorCode: 'MEAL_PLAN_TRIAL_LIMIT_REACHED' } };
      throw error;
    };

    await expect(createMealPlanCheckout('six-month')).rejects.toMatchObject({
      message: 'Trial limit reached.',
      status: 402,
      code: 'MEAL_PLAN_TRIAL_LIMIT_REACHED',
    });
  });
});
