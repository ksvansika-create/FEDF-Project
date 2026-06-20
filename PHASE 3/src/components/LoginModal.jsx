import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlight } from '../context/FlightContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useFlight();
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      onClose();
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@aerojet.com');
      setPassword('admin123');
    } else {
      setEmail('john.doe@aerojet.com');
      setPassword('user123');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-slate-950 p-8 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl z-10 glass-panel"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
          >
            ✕
          </button>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`text-lg font-semibold pb-1 border-b-2 transition-colors ${tab === 'login' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`text-lg font-semibold pb-1 border-b-2 transition-colors ${tab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:border-primary outline-none"
                  required
                />
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@domain.com"
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:border-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:border-primary outline-none"
                required
              />
            </div>

            <button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-xl p-3 text-sm font-semibold transition-colors mt-2 shadow-lg shadow-blue-500/20">
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Admin/User login helpers */}
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
            <span className="text-xs font-medium text-slate-400 block mb-2">💡 Quick Test Credentials</span>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleQuickLogin('user')}
                className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Standard User
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="text-xs bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg font-medium transition-colors border border-purple-200/50 dark:border-purple-800/30"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
