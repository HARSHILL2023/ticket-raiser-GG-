import { LOCAL_STORAGE_KEYS } from './constants';

// Auth Token and Session helpers
export const getAuthToken = () => localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
export const setAuthToken = (token) => localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, token);
export const removeAuthToken = () => localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);

export const getAuthUser = () => {
  const user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};
export const setAuthUser = (user) => localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
export const removeAuthUser = () => localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);

// --- LEGACY DEMO DATA CLEANUP ---
// Automatically remove old fake seeded complaints/users from localStorage
// This runs once on import to purge any leftover demo data from previous versions
(function cleanupLegacyMockData() {
  try {
    localStorage.removeItem('ctms_mock_tickets');
    localStorage.removeItem('ctms_mock_users');
  } catch (err) {
    // Silently fail if localStorage is unavailable
  }
})();

// Reset Session
export const clearAuthSession = () => {
  removeAuthToken();
  removeAuthUser();
};
