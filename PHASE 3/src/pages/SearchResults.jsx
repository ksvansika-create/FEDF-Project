import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import { useFlights } from '../hooks/useFlights';
import Filters from '../components/Filters';
import SortBar from '../components/SortBar';
import FlightCard from '../components/FlightCard';
import Loader from '../components/Loader';

export default function SearchResults() {
  const { searchQuery, setBookingSession } = useFlight();
  const { filteredResults, filterCriteria, setFilterCriteria, sortType, setSortType, loading } = useFlights();
  const navigate = useNavigate();

  const leg = searchQuery.legs[0];
  if (!leg?.from || !leg?.to) {
    // Return home if no active query
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-3xl mb-4">🔍</span>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Search Parameters Found</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">Please return to the landing page and configure your origin and destination airport parameters.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-6 py-2.5 rounded-xl mt-6 shadow-md transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleSelectFlight = (flight) => {
    // Setup booking session template based on passengers count
    const passengersArray = Array.from({ length: searchQuery.passengers }).map(() => ({
      firstName: '',
      lastName: '',
      gender: 'male',
      seat: ''
    }));

    setBookingSession({
      selectedFlight: flight,
      selectedReturnFlight: null,
      selectedSeats: [],
      passengers: passengersArray,
      contact: { email: '', phone: '' },
      insurance: false,
      promoCode: '',
      discount: 0
    });

    navigate('/booking');
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-4 pb-16 flex flex-col gap-6">
      {/* Back button & Route title info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 mb-2"
          >
            ← Change Query
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Flights from {leg.from} to {leg.to}
          </h1>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-1">
            {leg.date} • {searchQuery.passengers} Passenger{searchQuery.passengers > 1 ? 's' : ''} • {searchQuery.cabinClass} Class
          </span>
        </div>
      </div>

      {/* Main Results layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <Filters criteria={filterCriteria} onChange={setFilterCriteria} />

        {/* Search Results side */}
        <div className="flex-grow flex flex-col gap-4">
          <SortBar
            activeSort={sortType}
            onChange={setSortType}
            resultsCount={filteredResults.length}
          />

          {/* Price Prediction Alert */}
          <div className="glass-panel rounded-xl p-4 flex items-center gap-3 bg-white/60 dark:bg-slate-900/60 border border-slate-100/50 dark:border-slate-800/50">
            <span className="text-xl shrink-0">📈</span>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Price Advisory Widget</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Dynamic pricing patterns suggest booking now. Current fares are optimal, with a potential 6% rise in the next 3 days.
              </span>
            </div>
          </div>

          {/* Card list */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {/* Skeleton Cards loading shimmers */}
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 glass-panel rounded-xl w-full border border-slate-200/50 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-900/40 flex items-center p-6 gap-6 relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 skeleton-shimmer" />
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 skeleton-shimmer" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 skeleton-shimmer" />
                  </div>
                  <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl skeleton-shimmer shrink-0" />
                </div>
              ))}
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="glass-panel rounded-xl py-16 text-center text-slate-400 font-semibold bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
              No flights matching your filter criteria were found.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredResults.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onSelect={handleSelectFlight}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
