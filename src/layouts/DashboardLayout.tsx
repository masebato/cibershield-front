import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Server,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Threats', to: '/threats', icon: AlertTriangle },
  { label: 'Assets', to: '/assets', icon: Server },
  { label: 'Reports', to: '/reports', icon: FileBarChart2 },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function NavItemLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      end={item.to === '/dashboard'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50',
        ].join(' ')
      }
    >
      <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
      {item.label}
    </NavLink>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-700/60">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-100">
          Cyber<span className="text-cyan-400">Shield</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavItemLink key={item.to} item={item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* Version badge */}
      <div className="px-4 py-3 border-t border-slate-700/60">
        <p className="text-xs text-slate-600">v1.0.0 — Beta</p>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-800/80 border-r border-slate-700/60 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-56 bg-slate-800 border-r border-slate-700/60 flex flex-col z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between px-4 shrink-0 backdrop-blur-sm">
          <button
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block" />

          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-700/60 transition-colors text-slate-300 hover:text-slate-100"
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold uppercase">
                {user?.name?.[0] ?? 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-slate-900/80 py-1 z-50"
                onBlur={() => setUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-700">
                  <p className="text-xs font-medium text-slate-200 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
