import React, { useState } from 'react';
import { useFlight } from '../context/FlightContext';
import { formatCurrency } from '../utils/formatCurrency';

const PROMO_CODES = {
  'FLYHIGH20': { type: 'percent', value: 0.20 },
  'WELCOME500': { type: 'flat', value: 500 },
  'SUPERSTEAL': { type: 'percent', value: 0.30 }
};

export default function BookingSummary() {
  const { bookingSession, setBookingSession, searchQuery, currency, language, addNotification } = useFlight();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const flight = bookingSession.selectedFlight;
  if (!flight) return null;

  // Pricing calculations
  const multiplier = searchQuery.cabinClass === 'business' ? 2.2 : 1.0;
  const passCount = searchQuery.passengers;
  const baseFareTotal = Math.round(flight.price * multiplier * passCount);

  // Seat fees computation
  let seatFees = 0;
  bookingSession.selectedSeats.forEach(s => {
    const isWinOrAisle = s.seatCode.endsWith('A') || s.seatCode.endsWith('F') || s.seatCode.endsWith('C') || s.seatCode.endsWith('D');
    if (searchQuery.cabinClass === 'business') {
      seatFees += 800;
    } else if (isWinOrAisle) {
      seatFees += 250;
    }
  });

  const insuranceFee = bookingSession.insurance ? 299 * passCount : 0;
  const taxesTotal = 450;
  const subtotal = baseFareTotal + seatFees + taxesTotal + insuranceFee;
  const grandTotal = Math.max(0, subtotal - bookingSession.discount);

  const handleInsuranceToggle = (e) => {
    setBookingSession(prev => ({ ...prev, insurance: e.target.checked }));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      const promo = PROMO_CODES[code];
      let disc = 0;
      if (promo.type === 'percent') {
        disc = Math.round(baseFareTotal * promo.value);
      } else {
        disc = promo.value;
      }

      setBookingSession(prev => ({
        ...prev,
        promoCode: code,
        discount: disc
      }));
      setPromoSuccess(`Coupon applied! Saved ${formatCurrency(disc, currency, language)}`);
      addNotification('success', `Coupon ${code} applied successfully.`);
    } else {
      setPromoError('Invalid promo code.');
    }
  };

  return (
    <aside className="glass-panel rounded-xl p-5 flex flex-col gap-5 w-full md:max-w-[320px] h-fit">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
        Booking Summary
      </h3>

      {/* Flight info */}
      <div className="flex flex-col gap-1 text-slate-700 dark:text-slate-300">
        <span className="text-sm font-bold">{flight.from} → {flight.to}</span>
        <span className="text-xs text-slate-400 font-semibold">{flight.airline} • {flight.flightNumber}</span>
        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit mt-1 uppercase font-bold">
          {searchQuery.cabinClass} class
        </span>
      </div>

      {/* Breakdowns */}
      <div className="flex flex-col gap-2.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex justify-between">
          <span>Base Fare ({passCount} traveler{passCount > 1 ? 's' : ''})</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(baseFareTotal, currency, language)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Seat Fees</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(seatFees, currency, language)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Taxes & Carrier Fees</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(taxesTotal, currency, language)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Travel Insurance</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(insuranceFee, currency, language)}
          </span>
        </div>

        {bookingSession.discount > 0 && (
          <div className="flex justify-between text-emerald-500 font-bold">
            <span>Promo Code Discount</span>
            <span>-{formatCurrency(bookingSession.discount, currency, language)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm font-bold text-slate-800 dark:text-slate-100 border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 text-primary">
          <span className="text-primary dark:text-blue-400">Grand Total</span>
          <span className="text-base text-primary dark:text-blue-400">
            {formatCurrency(grandTotal, currency, language)}
          </span>
        </div>
      </div>

      {/* Insurance checkbox */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
        <label className="flex items-start gap-2.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={bookingSession.insurance}
            onChange={handleInsuranceToggle}
            className="rounded text-primary focus:ring-primary accent-primary w-4 h-4 mt-0.5"
          />
          <div>
            <span className="block text-slate-700 dark:text-slate-200">Secure my flight (+₹299/traveler)</span>
            <span className="text-[9px] text-slate-400 block font-normal mt-0.5 leading-snug">
              Covers medical emergencies, baggage loss, and trip cancellations up to ₹50,000.
            </span>
          </div>
        </label>
      </div>

      {/* Promo Code Input */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="e.g. FLYHIGH20"
            className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl px-3 py-2 outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 text-xs px-3 rounded-xl font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
        {promoError && <span className="text-[10px] font-semibold text-rose-500">{promoError}</span>}
        {promoSuccess && <span className="text-[10px] font-semibold text-emerald-500">{promoSuccess}</span>}
        <span className="text-[9px] text-slate-400">Codes: FLYHIGH20 (20%), WELCOME500 (₹500), SUPERSTEAL (30%)</span>
      </div>
    </aside>
  );
}
export { PROMO_CODES };
