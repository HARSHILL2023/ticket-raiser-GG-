export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MEMBER: 'Member'
};

export const TICKET_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Security',
  'Cleaning',
  'Others'
];

export const TICKET_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'ctms_auth_token',
  USER: 'ctms_auth_user'
};

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://ctms-backend-4wpy.onrender.com/api';
