import React from 'react';
import { useFlight } from '../context/FlightContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function Filters({ criteria, onChange }) {
  const { currency, language } = useFlight();

  const handlePriceChange = (e) => {
    onChange({ ...criteria, maxPrice: parseInt(e.target.value) });
  };

  const handleStopToggle = (stopCount) => {
    const list = [...criteria.stops];
    if (list.includes(stopCount)) {
      onChange({ ...criteria, stops: list.filter(s => s !== stopCount) });
    } else {
      onChange({ ...criteria, stops: [...list, stopCount] });
    }
  };

  const handleAirlineToggle = (airline) => {
    const list = [...criteria.airlines];
    if (list.includes(airline)) {
      onChange({ ...criteria, airlines: list.filter(a => a !== airline) });
    } else {
      onChange({ ...criteria, airlines: [...list, airline] });
    }
  };

  const handleTimeToggle = (slot) => {
    const list = [...criteria.departureTimeSlots];
    if (list.includes(slot)) {
      onChange({ ...criteria, departureTimeSlots: list.filter(t => t !== slot) });
    } else {
      onChange({ ...criteria, departureTimeSlots: [...list, slot] });
    }
  };

  return (
    <aside className="glass-panel rounded-xl p-5 flex flex-col gap-6 w-full md:max-w-[280px]">
      {/* Price Slider */}
      <div className="border-b border-slate-200/50 dark:border-slate-800 pb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price</span>
          <span className="text-sm font-bold text-primary dark:text-blue-400">
            {formatCurrency(criteria.maxPrice, currency, language)}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="25000"
          value={criteria.maxPrice}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
          <span>₹1k</span>
          <span>₹25k</span>
        </div>
      </div>

      {/* Stops */}
      <div className="border-b border-slate-200/50 dark:border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Stops</span>
        <div className="flex flex-col gap-2">
          {[0, 1].map((stop) => (
            <label key={stop} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.stops.includes(stop)}
                onChange={() => handleStopToggle(stop)}
                className="rounded text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              {stop === 0 ? 'Non-stop' : '1 Stop'}
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div className="border-b border-slate-200/50 dark:border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Airlines</span>
        <div className="flex flex-col gap-2">
          {['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet', 'Vistara'].map((airline) => (
            <label key={airline} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
                className="rounded text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              {airline}
            </label>
          ))}
        </div>
      </div>

      {/* Departure times */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Departure Slots</span>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Morning (05:00 - 12:00)', value: 'morning' },
            { label: 'Afternoon (12:00 - 18:00)', value: 'afternoon' },
            { label: 'Evening (18:00 - Midnight)', value: 'evening' }
          ].map((slot) => (
            <label key={slot.value} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.departureTimeSlots.includes(slot.value)}
                onChange={() => handleTimeToggle(slot.value)}
                className="rounded text-primary focus:ring-primary accent-primary w-4 h-4"
              />
              {slot.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
