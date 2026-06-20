import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full shadow-md shadow-blue-500/10"
      />
      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Searching flight catalog...</span>
    </div>
  );
}
