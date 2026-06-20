import React from 'react';

export default function TicketCard({ booking }) {
  if (!booking) return null;

  const { bookingId, pnr, flight, passengers, cabinClass, dateBooked } = booking;
  const travelersListText = passengers
    .map(p => `${p.firstName} ${p.lastName} (${p.seat})`)
    .join(', ');

  return (
    <div className="printable-area w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-5 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <span className="text-xl">✈️</span>
          <div className="flex flex-col">
            <span className="font-bold font-display tracking-wide text-sm">{flight.airline}</span>
            <span className="text-[10px] opacity-75">{flight.flightNumber}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] opacity-75 uppercase font-bold tracking-wider">Boarding PNR</span>
          <span className="font-mono text-lg font-bold tracking-widest leading-none">{pnr}</span>
        </div>
      </div>

      {/* Main Pass Body */}
      <div className="p-6 flex flex-col gap-6">
        {/* Route codes */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center text-center pb-5 border-b border-dashed border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-start text-left">
            <span className="text-3xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
              {flight.from}
            </span>
            <span className="text-xs text-slate-400 mt-1">{flight.fromCity}</span>
          </div>

          <span className="text-2xl text-slate-300 dark:text-slate-700">✈️</span>

          <div className="flex flex-col items-end text-right">
            <span className="text-3xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white">
              {flight.to}
            </span>
            <span className="text-xs text-slate-400 mt-1">{flight.toCity}</span>
          </div>

          {/* Left/Right circle punch cuts */}
          <div className="absolute bottom-[-10px] left-[-32px] w-5 h-5 rounded-full bg-slate-50 dark:bg-dark-bg border-r border-slate-200 dark:border-slate-800" />
          <div className="absolute bottom-[-10px] right-[-32px] w-5 h-5 rounded-full bg-slate-50 dark:bg-dark-bg border-l border-slate-200 dark:border-slate-800" />
        </div>

        {/* Flight details breakdown Grid */}
        <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-xs border-b border-dashed border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex flex-col">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Departure Time</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5">{flight.departureTime}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Arrival Time</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5">{flight.arrivalTime}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Cabin Class</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm mt-0.5 uppercase">{cabinClass}</span>
          </div>

          <div className="flex flex-col col-span-2">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Travelers (Seats)</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 text-xs mt-0.5 truncate" title={travelersListText}>
              {travelersListText}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Booking ID</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs mt-0.5">{bookingId}</span>
          </div>
        </div>

        {/* Boarding Info footer barcode */}
        <div className="flex justify-between items-center pt-2">
          <div className="barcode-simulated text-slate-800 dark:text-slate-400 shrink-0" />
          <div className="text-[10px] text-slate-400 text-right leading-relaxed font-semibold">
            <span>Gate closes 45 mins before flight</span>
            <span className="block font-bold text-slate-700 dark:text-slate-200 mt-0.5">GATE B2 • Terminal 3</span>
            <span className="block text-[9px] opacity-75 font-normal">Booked: {dateBooked}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
