import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/endpoints';
import { 
  getAuthToken, 
  getAuthUser, 
  setAuthToken, 
  setAuthUser, 
  clearAuthSession 
} from '../utils/localStorage';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session from localStorage on startup
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = getAuthToken();
        const storedUser = getAuthUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        clearAuthSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for unauthorized event from axios interceptor
    const handleUnauthorized = () => {
      logout(true); // true means force logout due to expired token
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      setAuthUser(data.user);
      
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.register(userData);
      
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
      setAuthUser(data.user);
      
      toast.success(`Welcome, ${data.user.name}! Account created successfully.`);
      return data.user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (sessionExpired = false) => {
    clearAuthSession();
    setUser(null);
    setToken(null);
    if (sessionExpired) {
      toast.error('Session expired. Please login again.');
    } else {
      toast.success('Logged out successfully.');
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
