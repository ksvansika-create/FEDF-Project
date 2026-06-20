import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import Hero from '../components/Hero';
import SearchForm from '../components/SearchForm';
import { formatCurrency } from '../utils/formatCurrency';

export default function Home() {
  const { recentSearches, setSearchQuery, currency, language, airportList } = useFlight();
  const navigate = useNavigate();

  const recommendedRoutes = [
    { from: 'DEL', fromCity: 'Delhi', to: 'BOM', toCity: 'Mumbai', price: 4199 },
    { from: 'BOM', fromCity: 'Mumbai', to: 'BLR', toCity: 'Bengaluru', price: 3499 },
    { from: 'DEL', fromCity: 'Delhi', to: 'BLR', toCity: 'Bengaluru', price: 5899 },
    { from: 'CCU', fromCity: 'Kolkata', to: 'DEL', toCity: 'Delhi', price: 4499 }
  ];

  const handleRecentClick = (search) => {
    // Reconstruct dates to tomorrow to ensure flight records display properly
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setSearchQuery({
      tripType: search.tripType,
      legs: [{
        from: search.from,
        fromLabel: `${search.fromCity} (${search.from})`,
        to: search.to,
        toLabel: `${search.toCity} (${search.to})`,
        date: tomorrowStr
      }],
      passengers: 1,
      cabinClass: 'economy',
      returnDate: ''
    });
    
    navigate('/search-results');
  };

  const handlePromoRouteClick = (route) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    setSearchQuery({
      tripType: 'oneway',
      legs: [{
        from: route.from,
        fromLabel: `${route.fromCity} (${route.from})`,
        to: route.to,
        toLabel: `${route.toCity} (${route.to})`,
        date: tomorrowStr
      }],
      passengers: 1,
      cabinClass: 'economy',
      returnDate: ''
    });

    navigate('/search-results');
  };

  return (
    <div className="flex flex-col gap-10 px-4 pb-16">
      {/* Brand animated intro */}
      <Hero />

      {/* Widget Container */}
      <SearchForm />

      {/* Recents list */}
      {recentSearches.length > 0 && (
        <section className="w-full max-w-5xl mx-auto flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🕒</span> Recent Searches
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentSearches.map((search, idx) => (
              <div
                key={idx}
                onClick={() => handleRecentClick(search)}
                className="glass-panel p-4 rounded-xl cursor-pointer hover:border-primary/40 flex items-center gap-3 bg-white/50 dark:bg-slate-900/50"
              >
                <div className="text-xl">🕒</div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                    {search.fromCity} to {search.toCity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                    {search.tripType} • {search.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Routes Cards */}
      <section className="w-full max-w-5xl mx-auto flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🔥</span> Popular Flight Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => handlePromoRouteClick(route)}
              className="glass-panel p-4 rounded-xl cursor-pointer hover:border-primary/40 flex items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/50"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                  {route.fromCity} to {route.toCity}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                  popular direct route
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-primary dark:text-blue-400 block">
                  {formatCurrency(route.price, currency, language)}
                </span>
                <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">one way</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
