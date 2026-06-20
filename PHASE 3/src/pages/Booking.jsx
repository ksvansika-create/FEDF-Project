import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import PassengerForm from '../components/PassengerForm';
import BookingSummary from '../components/BookingSummary';

export default function Booking() {
  const { bookingSession, addNotification } = useFlight();
  const navigate = useNavigate();

  if (!bookingSession.selectedFlight) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-3xl mb-4">✈️</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Selected Flight</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">Please search flights and select one before booking tickets.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-2.5 rounded-xl mt-6 shadow-md transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handlePassengersSubmit = (e) => {
    e.preventDefault();

    // Check if seats are assigned to all passengers
    const allSeatsAssigned = bookingSession.passengers.every(p => p.seat !== '');
    if (!allSeatsAssigned) {
      addNotification('warning', 'Please select a seat code for all travelers before continuing.');
      alert('Please select a seat for all travelers.');
      return;
    }

    // Direct to Payment screen
    navigate('/payment');
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 pb-16 flex flex-col gap-6">
      {/* Steps Indicator Tracker */}
      <div className="flex justify-between items-center relative max-w-lg w-full mx-auto mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 z-0 -translate-y-1/2" />
        
        {/* Step 1 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-primary text-white border border-primary text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-500/25">
            1
          </span>
          <span className="text-[10px] font-bold text-primary mt-1.5 uppercase tracking-wider">Travelers</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
            2
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Payment</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Confirm</span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Traveler form page section */}
        <div className="flex-grow w-full">
          <PassengerForm onSubmit={handlePassengersSubmit} />
        </div>

        {/* Sidebar Breakdowns widget */}
        <div className="shrink-0 w-full md:w-auto">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
