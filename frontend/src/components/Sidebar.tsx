'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl: string; isGuest: boolean } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
    { name: 'Projects', icon: FolderKanban, path: '#', active: false },
    { name: 'Tasks', icon: CheckSquare, path: '#', active: false },
    { name: 'Calendar', icon: Calendar, path: '#', active: false },
    { name: 'Members', icon: Users, path: '#', active: false },
    { name: 'Settings', icon: Settings, path: '#', active: false },
  ];

  return (
    <aside 
      className={`h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 relative shadow-sm ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapsible toggle button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 h-6 w-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-sm transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div>
        {/* Logo Section */}
        <div className={`p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/50 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/20 flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-800 dark:text-white leading-none">AbleSpace</span>
              <span className="text-[10px] text-brand-500 dark:text-brand-400 font-semibold mt-0.5 uppercase tracking-wider">Workspace</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  item.active 
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={item.name}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  item.active ? 'text-brand-500 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`} />
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'flex-col gap-4 items-center justify-center' : ''}`}>
          {user && (
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex-shrink-0"
            />
          )}
          {!isCollapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate leading-none mb-1">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user.email}</p>
            </div>
          )}
        </div>

        {/* Action button row */}
        <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/30 flex items-center justify-between gap-2 ${
          isCollapsed ? 'flex-col items-center mt-3 pt-3' : ''
        }`}>
          <ThemeToggle />
          
          <button
            onClick={onLogout}
            className={`flex items-center gap-2 p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all ${
              isCollapsed ? '' : 'text-xs font-semibold'
            }`}
            title="Log Out"
          >
            <LogOut className="h-4.5 w-4.5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
