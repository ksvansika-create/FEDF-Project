import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import BookingSummary from '../components/BookingSummary';
import { formatCurrency } from '../utils/formatCurrency';
import { generatePNR, generateBookingId } from '../utils/generatePNR';

export default function Payment() {
  const { bookingSession, searchQuery, confirmBooking, addNotification, currency, language } = useFlight();
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingSession.selectedFlight) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-3xl mb-4">💳</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Checkout Session Expired</h2>
        <button onClick={() => navigate('/')} className="bg-primary text-white text-xs font-semibold px-6 py-2 rounded-xl mt-4">
          Return Home
        </button>
      </div>
    );
  }

  // Calculate price dynamically for submit display
  const multiplier = searchQuery.cabinClass === 'business' ? 2.2 : 1.0;
  const passCount = searchQuery.passengers;
  const baseFare = Math.round(bookingSession.selectedFlight.price * multiplier * passCount);
  
  let seatFees = 0;
  bookingSession.selectedSeats.forEach(s => {
    const isWinOrAisle = s.seatCode.endsWith('A') || s.seatCode.endsWith('F') || s.seatCode.endsWith('C') || s.seatCode.endsWith('D');
    if (searchQuery.cabinClass === 'business') seatFees += 800;
    else if (isWinOrAisle) seatFees += 250;
  });

  const insuranceFee = bookingSession.insurance ? 299 * passCount : 0;
  const taxesTotal = 450;
  const subtotal = baseFare + seatFees + taxesTotal + insuranceFee;
  const grandTotal = Math.max(0, subtotal - bookingSession.discount);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const pnr = generatePNR();
      const bookingId = generateBookingId();
      
      const newBooking = {
        bookingId,
        pnr,
        flight: bookingSession.selectedFlight,
        passengers: bookingSession.passengers,
        cabinClass: searchQuery.cabinClass,
        contact: bookingSession.contact,
        totalPrice: grandTotal,
        currency,
        status: 'Confirmed',
        dateBooked: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      confirmBooking(newBooking);
      setIsProcessing(false);
      
      // Navigate to success confirmation page with state
      navigate('/confirmation', { state: { booking: newBooking } });
    }, 1800);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 pb-16 flex flex-col gap-6">
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
          <span className="w-8 h-8 rounded-full bg-primary text-white border border-primary text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-500/25">
            2
          </span>
          <span className="text-[10px] font-bold text-primary mt-1.5 uppercase tracking-wider">Payment</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative z-10">
          <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
            3
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Confirm</span>
        </div>
      </div>

      {/* Main payment content */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-grow w-full flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>💳</span> Payment Methods
          </h2>

          <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
            <div className="glass-panel rounded-xl p-5 flex flex-col gap-4 bg-white/50 dark:bg-slate-900/50">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Credit / Debit Card details
              </span>

              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, '').slice(0, 19))}
                  placeholder="4321 5678 9012 3456"
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                  required
                  pattern="[0-9 ]{16,19}"
                  disabled={isProcessing}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Card Holder Name</label>
                  <input
                    type="text"
                    value={holder}
                    onChange={(e) => setHolder(e.target.value)}
                    placeholder="John Doe"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value.slice(0, 5))}
                    placeholder="MM/YY"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                    pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    placeholder="•••"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                    pattern="[0-9]{3}"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all w-full mt-2 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  Authorizing Transaction...
                </>
              ) : (
                `Pay ${formatCurrency(grandTotal, currency, language)}`
              )}
            </button>
          </form>
        </div>

        {/* Price Breakdowns Sidebar */}
        <div className="shrink-0 w-full md:w-auto">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
