import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleGuard from '../components/common/RoleGuard';
import { ROLES } from '../utils/constants';

// Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import MemberDashboard from '../pages/member/MemberDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Path Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Guest Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Access Controlled Dashboards */}
      <Route element={<ProtectedRoute />}>
        {/* Flat Member Scope */}
        <Route element={<RoleGuard allowedRoles={[ROLES.MEMBER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/member/dashboard" element={<MemberDashboard />} />
          </Route>
        </Route>

        {/* Property Manager Scope */}
        <Route element={<RoleGuard allowedRoles={[ROLES.MANAGER]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          </Route>
        </Route>

        {/* Super Admin Scope */}
        <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Standalone Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;
