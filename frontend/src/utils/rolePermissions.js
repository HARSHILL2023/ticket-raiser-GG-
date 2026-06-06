import { ROLES } from './constants';

export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.MANAGER]: '/manager/dashboard',
  [ROLES.MEMBER]: '/member/dashboard'
};

/**
 * Checks if a given role is permitted to access a specific path pattern
 * @param {string} role - The user's role (Admin, Manager, Member)
 * @param {string} pathname - The active route path
 * @returns {boolean} - Whether the user has access
 */
export const hasPermission = (role, pathname) => {
  if (!role) return false;

  const normalizedPath = pathname.toLowerCase();
  
  if (role === ROLES.ADMIN) {
    return normalizedPath.startsWith('/admin') || normalizedPath === '/unauthorized';
  }
  
  if (role === ROLES.MANAGER) {
    return normalizedPath.startsWith('/manager') || normalizedPath === '/unauthorized';
  }
  
  if (role === ROLES.MEMBER) {
    return normalizedPath.startsWith('/member') || normalizedPath === '/unauthorized';
  }

  return false;
};
