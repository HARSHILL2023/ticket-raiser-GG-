import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Bell, LogOut, User } from 'lucide-react';

export const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass border-b border-zinc-800/50 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between text-slate-100">
      <div className="flex items-center space-x-3">
        {/* Toggle Sidebar for Mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-zinc-900/85 text-zinc-400 hover:text-zinc-100 lg:hidden transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Title Logo (hidden on mobile, shown on md+) */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-450 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/10">
            C
          </div>
          <span className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent hidden sm:inline-block">
            CTMS Community Portal
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 relative transition-all group cursor-pointer">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        {/* User Card */}
        <div className="flex items-center space-x-3 pl-3 border-l border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 font-semibold shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          
          <div className="hidden md:block text-left">
            <h4 className="text-sm font-semibold leading-none text-zinc-200">
              {user?.name || 'Guest User'}
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1 inline-block">
              {user?.role} {user?.flatNumber && `(Flat ${user.flatNumber})`}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={() => logout()}
            className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all ml-2 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
