import { describe, expect, test } from 'vitest';
import {
  getMealPlanCheckoutContext,
  MEAL_PLAN_CHECKOUT_CONTEXT_KEY,
  saveMealPlanCheckoutContext,
} from './mealPlanPaymentContext';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

describe('mealPlanPaymentContext', () => {
  test('stores local order ID and provider order code for the PayOS return route', () => {
    const storage = memoryStorage();
    saveMealPlanCheckoutContext({ orderId: 73, orderCode: 830073 }, storage);

    expect(storage.getItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY)).toBe(JSON.stringify({ orderId: 73, orderCode: 830073 }));
    expect(getMealPlanCheckoutContext('?orderCode=830073', storage)).toEqual({ orderId: 73, orderCode: 830073 });
  });

  test('rejects a return query whose provider order code does not match this tab checkout', () => {
    const storage = memoryStorage();
    saveMealPlanCheckoutContext({ orderId: 73, orderCode: 830073 }, storage);

    expect(getMealPlanCheckoutContext('?orderCode=830074', storage)).toBeNull();
  });

  test('rejects an invalid checkout context', () => {
    expect(() => saveMealPlanCheckoutContext({ orderId: 0, orderCode: 8 }, memoryStorage())).toThrow(/payment order/i);
  });
});
