import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const AuthLayout = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // If already authenticated, redirect to their respective dashboard instead of showing login
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated && user) {
    const dashboardPath = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 animated-bg relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-600/10 blur-[100px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent-600/10 blur-[130px] animate-pulse pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
