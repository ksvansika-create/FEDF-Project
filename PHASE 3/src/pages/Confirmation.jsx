import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import TicketCard from '../components/TicketCard';
import { motion } from 'framer-motion';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBookingSession } = useFlight();

  const booking = location.state?.booking;

  // Clear booking session on success load
  useEffect(() => {
    setBookingSession({
      selectedFlight: null,
      selectedReturnFlight: null,
      selectedSeats: [],
      passengers: [],
      contact: { email: '', phone: '' },
      insurance: false,
      promoCode: '',
      discount: 0
    });
  }, [setBookingSession]);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-3xl mb-4">🚨</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Booking Data Available</h2>
        <button onClick={() => navigate('/')} className="bg-primary text-white text-xs font-semibold px-6 py-2 rounded-xl mt-4">
          Return Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 pb-16 flex flex-col gap-6 items-center">
      {/* Steps Indicator Tracker */}
      <div className="flex justify-between items-center relative max-w-lg w-full mx-auto mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 z-0 -translate-y-1/2" />
        
        {/* Step 1 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Travelers</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Payment</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
            ✓
          </span>
          <span className="text-[10px] font-bold text-emerald-500 mt-1.5 uppercase tracking-wider">Confirm</span>
        </div>
      </div>

      {/* Confirmation Celebration */}
      <div className="text-center flex flex-col items-center gap-3 mt-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-5xl"
        >
          🎉
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
          Reservation Confirmed!
        </h1>
        <p className="text-xs text-slate-400 max-w-md">
          Your flight booking has been confirmed with the airline. Your ticket information is compiled in the pass below.
        </p>
      </div>

      {/* Ticket Pass render target */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full flex justify-center mt-6"
      >
        <TicketCard booking={booking} />
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handlePrint}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Print / Download Pass
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold px-6 py-3.5 rounded-xl border border-slate-200/50 dark:border-slate-700 transition-all hover:scale-105"
        >
          Book Another Flight
        </button>
      </div>
    </div>
  );
}
