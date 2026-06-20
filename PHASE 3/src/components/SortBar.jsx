import React from 'react';

export default function SortBar({ activeSort, onChange, resultsCount }) {
  return (
    <div className="glass-panel rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap bg-white/60 dark:bg-slate-900/60">
      <div className="flex gap-2">
        {[
          { label: 'Cheapest', value: 'cheapest' },
          { label: 'Fastest', value: 'fastest' },
          { label: 'Earliest Departure', value: 'earliest' },
          { label: 'Best Rated', value: 'rating' }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
              activeSort === tab.value
                ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
        {resultsCount} Flights Found
      </span>
    </div>
  );
}
