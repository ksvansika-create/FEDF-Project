import React from 'react';
import { useFlight } from '../context/FlightContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function FlightCard({ flight, onSelect }) {
  const { searchQuery, currency, language } = useFlight();
  
  // Calculate cabin class multiplier
  let finalPrice = flight.price;
  if (searchQuery.cabinClass === 'business') {
    finalPrice = Math.round(flight.price * 2.2);
  }

  const airlineColors = {
    'IndiGo': '#0B2B61',
    'Air India': '#E21D26',
    'Akasa Air': '#FF6F00',
    'SpiceJet': '#F52D2D',
    'Vistara': '#4C1542'
  };

  const logoBg = airlineColors[flight.airline] || '#2563EB';

  return (
    <div className="glass-panel relative overflow-hidden rounded-xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Rating Tag */}
      <span className="absolute top-3 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-md">
        ★ {flight.rating}
      </span>

      {/* Airline Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
          style={{ backgroundColor: logoBg }}
        >
          {flight.airlineCode}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-base leading-tight">{flight.airline}</span>
          <span className="text-xs text-slate-400 mt-0.5">{flight.flightNumber}</span>
        </div>
      </div>

      {/* Departure Info */}
      <div className="flex flex-col text-center md:text-left shrink-0">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{flight.departureTime}</span>
        <span className="text-xs text-slate-400 font-semibold uppercase mt-0.5">{flight.from}</span>
      </div>

      {/* Flight Stops progress indicator */}
      <div className="flex flex-col items-center justify-center min-w-[100px] shrink-0">
        <span className="text-[10px] text-slate-400 font-medium">{flight.durationText}</span>
        <div className="relative w-24 h-0.5 bg-slate-200 dark:bg-slate-700 my-2">
          <div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 -translate-y-1/2" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-1 text-slate-400 text-xs hover:text-primary transition-colors">
            ✈️
          </span>
        </div>
        <span className={`text-[10px] font-bold ${flight.stops === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Arrival Info */}
      <div className="flex flex-col text-center md:text-left shrink-0">
        <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{flight.arrivalTime}</span>
        <span className="text-xs text-slate-400 font-semibold uppercase mt-0.5">{flight.to}</span>
      </div>

      {/* Price & CTA Select */}
      <div className="flex items-center md:items-end justify-between md:justify-start md:flex-col gap-4 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-100 dark:border-slate-800 md:border-t-0">
        <div className="flex flex-col text-left md:text-right">
          <span className="text-xl font-bold text-primary dark:text-blue-400">{formatCurrency(finalPrice, currency, language)}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">per passenger</span>
        </div>
        <button
          onClick={() => onSelect(flight)}
          className="bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800/80 dark:hover:bg-primary font-semibold text-slate-800 dark:text-slate-200 text-xs px-5 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-transparent transition-all shadow-sm"
        >
          Select Flight
        </button>
      </div>
    </div>
  );
}
