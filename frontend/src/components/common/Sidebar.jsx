import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldAlert, 
  UserCheck, 
  X, 
  Wrench, 
  ShieldCheck 
} from 'lucide-react';

export const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const role = user?.role;

  const handleLinkClick = () => {
    // Auto-close sidebar on mobile after clicking
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Base navigation configuration per role
  const getNavLinks = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          {
            to: '/admin/dashboard',
            label: 'Admin Control Center',
            icon: LayoutDashboard
          }
        ];
      case ROLES.MANAGER:
        return [
          {
            to: '/manager/dashboard',
            label: 'Manager Feed',
            icon: FileText
          }
        ];
      case ROLES.MEMBER:
        return [
          {
            to: '/member/dashboard',
            label: 'My Complaints',
            icon: Wrench
          }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-35 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#090D0A] border-r border-zinc-800/50 z-40 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:h-auto lg:z-10 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div>
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-zinc-800/30">
            <span className="font-display font-semibold text-zinc-200">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick User Banner */}
          <div className="p-4 border-b border-zinc-800/30 hidden lg:block">
            <div className="bg-zinc-950/60 border border-zinc-800/50 rounded-2xl p-3.5 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-emerald-450 shadow-inner">
                {role === ROLES.ADMIN ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : role === ROLES.MANAGER ? (
                  <UserCheck className="w-5 h-5" />
                ) : (
                  <Wrench className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Access Scope</p>
                <h4 className="text-sm font-semibold text-zinc-200">{role} Workspace</h4>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 relative group overflow-hidden ${
                      isActive
                        ? 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 font-semibold shadow-inner'
                        : 'text-zinc-400 border border-transparent hover:bg-zinc-900/40 hover:text-zinc-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/50" />
                      )}
                      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                        isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`} />
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-800/30">
          <div className="bg-zinc-950/40 border border-zinc-800/30 rounded-xl p-3.5 text-center">
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              Need assistance?
            </p>
            <a 
              href="mailto:support@ctms.com" 
              className="text-xs text-emerald-450 font-semibold hover:text-emerald-350 hover:underline mt-1 inline-block transition-colors"
            >
              support@ctms.com
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
