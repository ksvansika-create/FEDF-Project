import React, { useState } from 'react';
import { useFlight } from '../context/FlightContext';
import SeatMap from './SeatMap';

export default function PassengerForm({ onSubmit }) {
  const { bookingSession, setBookingSession, savedPassengers } = useFlight();
  
  // Seat modal trigger controls
  const [activePassIdx, setActivePassIdx] = useState(null);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);

  const handleTextChange = (val, idx, field) => {
    const updated = [...bookingSession.passengers];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setBookingSession(prev => ({ ...prev, passengers: updated }));
  };

  const handleSavedPassengerSelect = (sp, idx) => {
    const updated = [...bookingSession.passengers];
    updated[idx] = {
      ...updated[idx],
      firstName: sp.firstName,
      lastName: sp.lastName,
      gender: sp.gender
    };
    setBookingSession(prev => ({ ...prev, passengers: updated }));
  };

  const handleContactChange = (val, field) => {
    setBookingSession(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val
      }
    }));
  };

  const openSeatPicker = (idx) => {
    setActivePassIdx(idx);
    setIsSeatMapOpen(true);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 w-full">
        {/* Passengers Inputs */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>👤</span> Traveler Details
          </h2>

          {bookingSession.passengers.map((p, idx) => (
            <div key={idx} className="glass-panel rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Traveler #{idx + 1}
                </span>

                {/* Quick saved profile selector */}
                {savedPassengers.length > 0 && (
                  <select
                    onChange={(e) => {
                      const profile = savedPassengers.find(sp => `${sp.firstName} ${sp.lastName}` === e.target.value);
                      if (profile) handleSavedPassengerSelect(profile, idx);
                    }}
                    defaultValue=""
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold rounded-lg px-2 py-1 cursor-pointer hover:border-primary transition-colors outline-none"
                  >
                    <option value="" disabled>Load Saved Profile</option>
                    {savedPassengers.map((sp, spIdx) => (
                      <option key={spIdx} value={`${sp.firstName} ${sp.lastName}`}>
                        {sp.firstName} {sp.lastName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={p.firstName || ''}
                    onChange={(e) => handleTextChange(e.target.value, idx, 'firstName')}
                    placeholder="Enter first name"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                  />
                </div>

                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={p.lastName || ''}
                    onChange={(e) => handleTextChange(e.target.value, idx, 'lastName')}
                    placeholder="Enter last name"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                  />
                </div>

                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gender</label>
                  <select
                    value={p.gender || 'male'}
                    onChange={(e) => handleTextChange(e.target.value, idx, 'gender')}
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5 cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={() => openSeatPicker(idx)}
                  className="bg-secondary/10 hover:bg-secondary text-secondary hover:text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all border border-secondary/20 hover:border-transparent shadow-sm"
                >
                  Choose Cabin Seat
                </button>
                <span className="text-xs font-bold text-slate-400">
                  {p.seat ? `Seat Assigned: ${p.seat}` : '⚠️ No Seat Selected'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={bookingSession.contact.email || ''}
                onChange={(e) => handleContactChange(e.target.value, 'email')}
                placeholder="passenger@airline.com"
                className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                required
              />
            </div>

            <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mobile Number</label>
              <input
                type="tel"
                value={bookingSession.contact.phone || ''}
                onChange={(e) => handleContactChange(e.target.value, 'phone')}
                placeholder="98765 43210"
                className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all w-full mt-2 hover:scale-[1.01]"
        >
          Proceed to Checkout
        </button>
      </form>

      {/* Seat layout overlay popup */}
      <SeatMap
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        passengerIndex={activePassIdx}
      />
    </>
  );
}
