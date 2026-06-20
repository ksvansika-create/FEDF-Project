import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function AdminDashboard() {
  const {
    user,
    bookings,
    flights,
    addFlight,
    deleteFlight,
    updateFlightPrice,
    cancelBooking,
    currency,
    language,
    airportList
  } = useFlight();

  const navigate = useNavigate();

  // New Flight state variables
  const [airline, setAirline] = useState('IndiGo');
  const [airlineCode, setAirlineCode] = useState('6E');
  const [flightNumber, setFlightNumber] = useState('');
  const [fromCode, setFromCode] = useState('DEL');
  const [toCode, setToCode] = useState('BOM');
  const [depTime, setDepTime] = useState('');
  const [arrTime, setArrTime] = useState('');
  const [stops, setStops] = useState(0);
  const [durationMin, setDurationMin] = useState(120);
  const [price, setPrice] = useState(3999);

  // Quick states update pricing values
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [editingPrice, setEditingPrice] = useState(0);

  // Access check
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-3xl mb-4">🔒</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Access Restricted</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">Only administrator accounts can view booking logs and active flight schedules.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-2.5 rounded-xl mt-6 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Computing stats
  const totalRevenue = bookings.reduce((sum, b) => b.status === 'Confirmed' ? sum + b.totalPrice : sum, 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const businessCount = bookings.filter(b => b.cabinClass === 'business').length;
  const economyCount = totalBookings - businessCount;

  const handleCreateFlight = (e) => {
    e.preventDefault();
    
    if (fromCode === toCode) {
      alert('Origin and destination cannot be the same.');
      return;
    }

    const newFlight = {
      airline,
      airlineCode,
      flightNumber: `${airlineCode}-${flightNumber}`,
      from: fromCode,
      fromCity: airportList.find(a => a.code === fromCode)?.city || fromCode,
      fromAirport: airportList.find(a => a.code === fromCode)?.name || '',
      to: toCode,
      toCity: airportList.find(a => a.code === toCode)?.city || toCode,
      toAirport: airportList.find(a => a.code === toCode)?.name || '',
      departureTime: depTime,
      arrivalTime: arrTime,
      durationMinutes: durationMin,
      stops: parseInt(stops),
      price: parseInt(price),
      rating: 4.2
    };

    addFlight(newFlight);

    // Reset Form Fields
    setFlightNumber('');
    setDepTime('');
    setArrTime('');
    setPrice(3999);
  };

  const handlePriceUpdate = (flightId) => {
    updateFlightPrice(flightId, editingPrice);
    setEditingFlightId(null);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 pb-16 flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">🛠️ Administration Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Manage system schedules, review financial stats, and audit active passenger reservation logs.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl bg-white/50 dark:bg-slate-900/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">
            {formatCurrency(totalRevenue, currency, language)}
          </span>
          <span className="text-[9px] text-emerald-500 font-semibold block mt-1">▲ Simulated Earnings</span>
        </div>

        <div className="glass-panel p-5 rounded-xl bg-white/50 dark:bg-slate-900/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">{totalBookings}</span>
          <span className="text-[9px] text-slate-400 font-semibold block mt-1">Includes cancellations</span>
        </div>

        <div className="glass-panel p-5 rounded-xl bg-white/50 dark:bg-slate-900/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Passes</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white mt-1 block">{activeBookings}</span>
          <span className="text-[9px] text-teal-500 font-semibold block mt-1">Confirmed status</span>
        </div>

        <div className="glass-panel p-5 rounded-xl bg-white/50 dark:bg-slate-900/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cabin Distribution</span>
          <div className="flex items-center gap-1 mt-2">
            <div
              className="bg-primary h-2 rounded-l"
              style={{ width: `${totalBookings > 0 ? (economyCount / totalBookings) * 100 : 50}%` }}
              title="Economy"
            />
            <div
              className="bg-purple-500 h-2 rounded-r"
              style={{ width: `${totalBookings > 0 ? (businessCount / totalBookings) * 100 : 50}%` }}
              title="Business"
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-semibold">
            <span>Eco: {economyCount}</span>
            <span>Bus: {businessCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Bookings log registry */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📋</span> Active Customer Bookings
          </h2>

          <div className="glass-panel rounded-xl overflow-hidden bg-white/50 dark:bg-slate-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Flight</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Travelers</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">No bookings logged in session database.</td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.bookingId}>
                        <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {b.bookingId}
                          <span className="block text-[8px] opacity-75 font-normal">{b.dateBooked}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{b.flight.airline}</span>
                          <span className="block text-[9px] opacity-75 font-mono">{b.flight.flightNumber}</span>
                        </td>
                        <td className="p-4 uppercase">{b.flight.from} → {b.flight.to}</td>
                        <td className="p-4 truncate max-w-[120px]">
                          {b.passengers.map(p => `${p.firstName} (${p.seat})`).join(', ')}
                        </td>
                        <td className="p-4 font-bold text-primary">
                          {formatCurrency(b.totalPrice, b.currency, language)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {b.status === 'Confirmed' && (
                            <button
                              onClick={() => cancelBooking(b.bookingId)}
                              className="text-[10px] text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded-md transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Flight addition tools */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>✈️</span> Add Flight Segment
          </h2>

          <form onSubmit={handleCreateFlight} className="glass-panel p-5 rounded-xl flex flex-col gap-3 bg-white/50 dark:bg-slate-900/50">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Airline</label>
                <select
                  value={airline}
                  onChange={(e) => {
                    setAirline(e.target.value);
                    const mapping = { 'IndiGo': '6E', 'Air India': 'AI', 'Akasa Air': 'QP', 'SpiceJet': 'SG', 'Vistara': 'UK' };
                    setAirlineCode(mapping[e.target.value] || '6E');
                  }}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5 cursor-pointer"
                >
                  <option value="IndiGo">IndiGo</option>
                  <option value="Air India">Air India</option>
                  <option value="Akasa Air">Akasa Air</option>
                  <option value="SpiceJet">SpiceJet</option>
                  <option value="Vistara">Vistara</option>
                </select>
              </div>

              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Flight No</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                  placeholder="302"
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Origin</label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5 cursor-pointer"
                >
                  {airportList.map(a => <option key={a.code} value={a.code}>{a.code} ({a.city})</option>)}
                </select>
              </div>

              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Destination</label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5 cursor-pointer"
                >
                  {airportList.map(a => <option key={a.code} value={a.code}>{a.code} ({a.city})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Departure</label>
                <input
                  type="text"
                  value={depTime}
                  onChange={(e) => setDepTime(e.target.value)}
                  placeholder="08:30"
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5"
                  required
                />
              </div>

              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Arrival</label>
                <input
                  type="text"
                  value={arrTime}
                  onChange={(e) => setArrTime(e.target.value)}
                  placeholder="10:45"
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col col-span-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Price (INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5"
                  required
                />
              </div>

              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-primary transition-all">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Stops</label>
                <select
                  value={stops}
                  onChange={(e) => setStops(parseInt(e.target.value))}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none w-full mt-0.5 cursor-pointer"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-colors mt-2"
            >
              Add Flight segment
            </button>
          </form>
        </div>
      </div>

      {/* Flight schedule table list */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>✈️</span> Flight Schedule Editor
        </h2>
        <div className="glass-panel rounded-xl overflow-hidden bg-white/50 dark:bg-slate-900/50">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-4">Flight</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Times</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {flights.map((f) => (
                  <tr key={f.id}>
                    <td className="p-4">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{f.airline}</span>
                      <span className="block text-[9px] opacity-75 font-mono">{f.flightNumber}</span>
                    </td>
                    <td className="p-4 uppercase">{f.from} → {f.to}</td>
                    <td className="p-4 font-mono">{f.departureTime} - {f.arrivalTime}</td>
                    <td className="p-4 font-bold text-primary">
                      {editingFlightId === f.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={(e) => setEditingPrice(parseInt(e.target.value) || 0)}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs rounded w-16 p-1 outline-none"
                          />
                          <button
                            onClick={() => handlePriceUpdate(f.id)}
                            className="bg-emerald-500 text-white px-1.5 py-1 rounded hover:bg-emerald-600 transition-colors"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span>{formatCurrency(f.price, currency, language)}</span>
                          <button
                            onClick={() => {
                              setEditingFlightId(f.id);
                              setEditingPrice(f.price);
                            }}
                            className="text-[9px] text-slate-400 hover:text-primary"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteFlight(f.id)}
                        className="text-[10px] text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
