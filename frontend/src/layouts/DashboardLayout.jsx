import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F0C] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-transparent relative">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-700/5 blur-[120px] pointer-events-none -z-10"></div>

          {/* Render Active Route Page */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
