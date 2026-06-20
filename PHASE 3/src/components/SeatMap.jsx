import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlight } from '../context/FlightContext';

export default function SeatMap({ isOpen, onClose, passengerIndex }) {
  const { bookingSession, setBookingSession, searchQuery } = useFlight();
  
  const isBusiness = searchQuery.cabinClass === 'business';
  const totalRows = isBusiness ? 5 : 20;
  const startRow = isBusiness ? 1 : 6;
  const seatLetters = ['A', 'B', 'C', '', 'D', 'E', 'F'];

  const handleSeatClick = (seatCode) => {
    // Check if seat is occupied by another traveler in the booking session
    const isClaimedBySelfGroup = bookingSession.passengers.some(
      (p, i) => i !== passengerIndex && p.seat === seatCode
    );
    if (isClaimedBySelfGroup) return;

    // Clone passenger database
    const updatedPassengers = [...bookingSession.passengers];
    updatedPassengers[passengerIndex] = {
      ...updatedPassengers[passengerIndex],
      seat: seatCode
    };

    // Sync selectedSeats array
    const updatedSeats = bookingSession.selectedSeats.filter(
      (s) => s.passIndex !== passengerIndex
    );
    updatedSeats.push({ passIndex: passengerIndex, seatCode });

    setBookingSession(prev => ({
      ...prev,
      passengers: updatedPassengers,
      selectedSeats: updatedSeats
    }));

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative bg-white dark:bg-slate-950 p-6 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-xl max-h-[85vh] overflow-y-auto z-10 glass-panel"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">
            ✕
          </button>

          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">
            Choose Seat for Passenger #{passengerIndex + 1}
          </h3>

          <div className="flex flex-col items-center gap-6">
            {/* Cockpit Label */}
            <div className="text-[10px] tracking-[0.2em] font-extrabold text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-5 py-1.5 rounded-lg">
              COCKPIT
            </div>

            {/* Cabin rows */}
            <div className="w-full flex flex-col gap-1.5 max-w-[320px] bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl">
              {Array.from({ length: totalRows }).map((_, r) => {
                const rowNum = startRow + r;
                return (
                  <div key={rowNum} className="grid grid-cols-[repeat(3,1fr)_30px_repeat(3,1fr)] gap-1 text-center items-center">
                    {seatLetters.map((letter, lIdx) => {
                      if (letter === '') {
                        return <span key={lIdx} className="text-[10px] font-bold text-slate-400 select-none">{rowNum}</span>;
                      }

                      const seatCode = `${rowNum}${letter}`;
                      
                      // Simulated occupied check: dynamic but consistent
                      const isOccupiedBySimulation = (rowNum + letter.charCodeAt(0)) % 3 === 0;
                      const isSelectedByGroup = bookingSession.selectedSeats.some(s => s.seatCode === seatCode);
                      const isSelectedByThisPass = bookingSession.passengers[passengerIndex]?.seat === seatCode;
                      const isOtherPassSelection = isSelectedByGroup && !isSelectedByThisPass;

                      let cellClass = isBusiness 
                        ? 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5' 
                        : 'border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/5';

                      let isDisabled = false;

                      if (isOccupiedBySimulation || isOtherPassSelection) {
                        cellClass = 'bg-slate-200 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
                        isDisabled = true;
                      } else if (isSelectedByThisPass) {
                        cellClass = 'bg-primary border-primary text-white shadow-md shadow-blue-500/20';
                      }

                      return (
                        <button
                          key={letter}
                          disabled={isDisabled}
                          onClick={() => handleSeatClick(seatCode)}
                          className={`aspect-square text-[9px] font-extrabold border rounded-md flex items-center justify-center transition-all ${
                            !isDisabled && 'hover:bg-primary hover:border-transparent hover:text-white'
                          } ${cellClass}`}
                        >
                          {seatCode}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center flex-wrap gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded border border-teal-500/30 bg-teal-500/5" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-850 border border-slate-200 dark:border-slate-800" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded bg-primary border-primary" />
                <span>Selected</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
