import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getAuthToken, clearAuthSession } from '../utils/localStorage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token to request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors (e.g., token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clean up credentials and trigger reload/logout event
    if (error.response && error.response.status === 401) {
      clearAuthSession();
      // Dispatch custom event to notify AuthContext to log out user
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
