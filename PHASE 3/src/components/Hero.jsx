import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative text-center py-12 px-4 flex flex-col items-center justify-center max-w-4xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-4xl md:text-6xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-4 leading-tight"
      >
        Fly Premium. <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Search Smarter.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-normal"
      >
        Explore direct routes between major Indian travel hubs. Enjoy custom seat layouts, dynamic price checks, and instant ticket confirmations.
      </motion.p>
    </div>
  );
}
