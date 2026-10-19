import axios from '../lib/axios';

async function request(operation) {
  try {
    return (await operation()).data;
  } catch (cause) {
    if (cause.code === 'ERR_CANCELED') throw cause;
    const data = cause.response?.data;
    const errors = Array.isArray(data?.errors)
      ? data.errors.map(error => error.Error ?? error.error)
      : Object.values(data?.errors ?? {}).flat();
    const message = errors.filter(Boolean).join(' ')
      || data?.message
      || data?.error
      || data?.detail
      || data?.title
      || 'Could not connect to the payment service. Please try again.';
    throw Object.assign(new Error(message, { cause }), {
      status: cause.response?.status,
      code: data?.errorCode ?? data?.code,
    });
  }
}

export const getMealPlanPackages = () => request(() =>
  axios.get('/meal-plan-payments/packages'));

export const createMealPlanCheckout = packageCode => request(() =>
  axios.post('/meal-plan-payments/checkout', { packageCode }));

export const getMealPlanPaymentOrder = (orderId, signal) => request(() =>
  axios.get(`/meal-plan-payments/orders/${orderId}`, { signal }));

export const getMealPlanAccess = signal => request(() =>
  axios.get('/meal-plan-payments/access', { signal }));
