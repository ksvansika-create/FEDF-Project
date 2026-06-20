import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { theme, setTheme, currency, setCurrency, language, setLanguage, user, logout } = useFlight();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <>
      <nav className="glass-panel sticky top-0 z-[100] px-6 py-4 flex items-center justify-between border-b rounded-none border-white/20 dark:border-white/5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <span>✈️ AeroJet</span>
        </Link>

        {/* Global Controls */}
        <div className="flex items-center gap-4">
          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none hover:border-primary transition-colors"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>

          {/* Language */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/60 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer outline-none hover:border-primary transition-colors"
          >
            <option value="EN">English</option>
            <option value="HI">Hindi</option>
            <option value="ES">Español</option>
            <option value="FR">Français</option>
          </select>

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-750 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Admin Dashboard shortcut */}
          {user?.role === 'admin' && (
            <button
              onClick={handleAdminClick}
              className="text-xs bg-purple-500 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg shadow-purple-500/25 transition-all"
            >
              🛠️ Admin panel
            </button>
          )}

          {/* User Auth Profile Trigger */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold hidden md:inline">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-xs border border-rose-500/30 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10 font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-xs bg-primary hover:bg-primary-hover text-white font-semibold px-5 py-2 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Login Modal Overlay */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
