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
    const message = details.filter(Boolean).join(' ') || data?.message || data?.error || data?.detail || data?.title
      || 'Could not reach the server. Check that the backend is running and try again.';
    throw Object.assign(new Error(message, { cause }), { status: cause.response?.status, code: data?.errorCode ?? data?.code });
  }
}

export const listMealPlans = (pageIndex = 1, signal) => request(() =>
  axios.get('/MealPlans', { params: { pageIndex, pageSize: 10 }, signal }));

export const getMealPlan = (id, signal) => request(() =>
  axios.get(`/MealPlans/${id}`, { signal }));

export const renameMealPlan = (id, name) => request(() =>
  axios.patch(`/MealPlans/${id}/name`, { name })).catch(failure => {
  if (failure.status === 404) {
    throw Object.assign(new Error('The running backend does not have the menu rename endpoint yet. Restart it with the latest meal-planning code.'), { status: failure.status, cause: failure });
  }
  if (failure.status >= 500 && failure.message === 'An internal server error occurred.') {
    throw Object.assign(new Error('The backend could not save this name. If the latest backend is running, apply the AddMealPlanNames database migration and try again.'), { status: failure.status, cause: failure });
  }
  throw failure;
});

// A successful response already contains the persisted plan; do not POST again to save it.
export const generateMealPlan = input => request(() =>
  axios.post('/MealPlans/generate', typeof input === 'string' ? { startDate: input } : input, { timeout: 30000 }));

export const regenerateMealPlan = id => request(() =>
  axios.post(`/MealPlans/${id}/regenerate`, {}, { timeout: 30000 }));

export const archiveMealPlan = id => request(() => axios.delete(`/MealPlans/${id}`));

export const previewGoal = input => request(() => axios.post('/MealPlans/goal-preview', input));
export const logMeal = (id, input) => request(() => axios.put(`/MealPlans/${id}/tracking`, input));
export const updateMealReminders = (id, input) => request(() => axios.put(`/MealPlans/${id}/reminders`, input));
export const previewMealRevision = (id, input) => request(() => axios.post(`/MealPlans/${id}/revision-preview`, input));
export const confirmMealRevision = (id, input) => request(() => axios.post(`/MealPlans/${id}/revisions`, input, { timeout: 30000 }));
