export const MEAL_PLAN_CHECKOUT_CONTEXT_KEY = 'veganhelper:meal-plan-checkout';

const browserSessionStorage = () =>
  typeof window === 'undefined' ? null : window.sessionStorage;

export function saveMealPlanCheckoutContext(checkout, storage = browserSessionStorage()) {
  const orderId = Number(checkout?.orderId);
  const orderCode = Number(checkout?.orderCode);
  if (!storage || !Number.isSafeInteger(orderId) || orderId < 1
    || !Number.isSafeInteger(orderCode) || orderCode < 1) {
    throw new Error('The payment order could not be saved for status confirmation.');
  }

  storage.setItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY, JSON.stringify({ orderId, orderCode }));
}

export function getMealPlanCheckoutContext(search = '', storage = browserSessionStorage()) {
  if (!storage) return null;

  let saved;
  try {
    saved = JSON.parse(storage.getItem(MEAL_PLAN_CHECKOUT_CONTEXT_KEY) || 'null');
  } catch {
    return null;
  }

  const orderId = Number(saved?.orderId);
  const orderCode = Number(saved?.orderCode);
  if (!Number.isSafeInteger(orderId) || orderId < 1
    || !Number.isSafeInteger(orderCode) || orderCode < 1) {
    return null;
  }

  const returnedOrderCode = new URLSearchParams(search).get('orderCode');
  if (returnedOrderCode && Number(returnedOrderCode) !== orderCode) return null;

  return { orderId, orderCode };
}
