import axios from '../lib/axios';

async function request(operation) {
  try {
    return (await operation()).data;
  } catch (cause) {
    if (cause.code === 'ERR_CANCELED') throw cause;
    const data = cause.response?.data;
    const details = Array.isArray(data?.errors)
      ? data.errors.map(error => error.Error ?? error.error)
      : Object.values(data?.errors ?? {}).flat();
    const message = details.filter(Boolean).join(' ') || data?.message || data?.title
      || 'Could not connect to the server. If you were creating a plan, reload saved plans before trying again: it may already have been saved.';
    throw Object.assign(new Error(message, { cause }), { status: cause.response?.status });
  }
}

export const listMealPlans = (pageIndex = 1, signal) => request(() =>
  axios.get('/MealPlans', { params: { pageIndex, pageSize: 10 }, signal }));

export const getMealPlan = (id, signal) => request(() =>
  axios.get(`/MealPlans/${id}`, { signal }));

// A successful response already contains the persisted plan; do not POST again to save it.
export const generateMealPlan = startDate => request(() =>
  axios.post('/MealPlans/generate', { startDate }, { timeout: 30000 }));
