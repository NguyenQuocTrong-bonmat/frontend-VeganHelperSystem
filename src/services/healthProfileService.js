import axiosInstance from '../lib/axios';

export async function getHealthProfile() {
  try {
    const response = await axiosInstance.get('/HealthProfile');
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function updateHealthProfile(data) {
  try {
    const response = await axiosInstance.put('/HealthProfile', data);
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function declareAllergies(data) {
  try {
    const response = await axiosInstance.put('/HealthProfile/allergies', data);
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function getBmiResult() {
  try {
    const response = await axiosInstance.get('/HealthProfile/bmi');
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function getBmiHistory() {
  try {
    const response = await axiosInstance.get('/HealthProfile/bmi-history');
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}
