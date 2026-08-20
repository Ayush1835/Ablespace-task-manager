'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check initial theme from document element class list or localstorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 focus:outline-none"
      aria-label="Toggle Theme"
    >
      <div className="relative h-5 w-5 overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === 'dark' ? 'translate-y-8 rotate-45' : 'translate-y-0 rotate-0'
          }`}
        >
          <Sun className="h-5 w-5 text-amber-500" />
        </div>
        {/* Moon Icon */}
        <div
          className={`absolute inset-0 transition-transform duration-300 ${
            theme === 'light' ? '-translate-y-8 -rotate-45' : 'translate-y-0 rotate-0'
          }`}
        >
          <Moon className="h-5 w-5 text-indigo-400" />
        </div>
      </div>
    </button>
  );
}
