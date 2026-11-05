import axios from '../lib/axios';

async function request(operation) {
  try {
    return (await operation()).data;
  } catch (cause) {
    if (cause.code === 'ERR_CANCELED') throw cause;
    if (!cause.response) {
      const message = cause.code === 'ECONNABORTED'
        ? 'The menu request timed out. Check your plan history before trying again; the server may have saved it.'
        : 'Could not confirm whether your menu was saved. Check Plan history before trying again.';
      throw Object.assign(new Error(message, { cause }), { code: cause.code });
    }
    const data = cause.response?.data;
    const fieldLabel = field => String(field || '').split('.').pop().replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, letter => letter.toUpperCase());
    const details = Array.isArray(data?.errors)
      ? data.errors.map(error => `${fieldLabel(error.Field ?? error.field)}: ${error.Error ?? error.error}`)
      : Object.entries(data?.errors ?? {}).flatMap(([field, errors]) =>
        (Array.isArray(errors) ? errors : [errors]).map(error => `${fieldLabel(field)}: ${error}`));
    const message = details.filter(detail => detail && !detail.endsWith(': undefined')).join(' ') || data?.message || data?.error || data?.detail || data?.title
      || `The menu request failed (HTTP ${cause.response.status}). Please try again.`;
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
    throw Object.assign(new Error('Open the menu again from Plan history before renaming it. If it is no longer listed, choose another menu.'), { status: failure.status, cause: failure });
  }
  if (failure.status >= 500 && failure.message === 'An internal server error occurred.') {
    throw Object.assign(new Error('We could not save the new name right now. Please try again in a moment.'), { status: failure.status, cause: failure });
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
