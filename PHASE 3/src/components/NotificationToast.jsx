import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFlight } from '../context/FlightContext';

export default function NotificationToast() {
  const { notifications, removeNotification } = useFlight();

  const getAlertStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'error':
        return 'bg-rose-500 text-white border-rose-600';
      case 'warning':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '🎉';
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 glass-panel ${getAlertStyle(notif.type)}`}
          >
            <span className="text-xl flex-shrink-0">{getIcon(notif.type)}</span>
            <div className="flex-grow">
              <p className="text-sm font-medium">{notif.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-white hover:text-slate-200 transition-colors text-xs font-semibold px-1"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
