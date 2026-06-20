import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';

export default function SearchForm() {
  const { searchQuery, setSearchQuery, airportList, recentSearches, setRecentSearches } = useFlight();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState(searchQuery.tripType);
  const [legs, setLegs] = useState(searchQuery.legs.length > 0 ? searchQuery.legs : [{ from: '', fromLabel: '', to: '', toLabel: '', date: '' }]);
  const [returnDate, setReturnDate] = useState(searchQuery.returnDate || '');
  const [passengers, setPassengers] = useState(searchQuery.passengers);
  const [cabinClass, setCabinClass] = useState(searchQuery.cabinClass);

  // Suggestions state
  const [suggestions, setSuggestions] = useState({}); // { 'from-0': [], 'to-0': [] }
  const [activeInput, setActiveInput] = useState(null);

  const handleAirportSearch = (val, key) => {
    const list = [...legs];
    if (key.startsWith('from')) {
      const idx = parseInt(key.split('-')[1]);
      list[idx].fromLabel = val;
      setLegs(list);
    } else {
      const idx = parseInt(key.split('-')[1]);
      list[idx].toLabel = val;
      setLegs(list);
    }

    if (!val) {
      setSuggestions(prev => ({ ...prev, [key]: [] }));
      return;
    }

    const filtered = airportList.filter(ap =>
      ap.code.toLowerCase().includes(val.toLowerCase()) ||
      ap.city.toLowerCase().includes(val.toLowerCase()) ||
      ap.name.toLowerCase().includes(val.toLowerCase())
    );

    setSuggestions(prev => ({ ...prev, [key]: filtered }));
  };

  const handleSelectAirport = (ap, key) => {
    const list = [...legs];
    const idx = parseInt(key.split('-')[1]);
    
    if (key.startsWith('from')) {
      list[idx].from = ap.code;
      list[idx].fromLabel = `${ap.city} (${ap.code})`;
    } else {
      list[idx].to = ap.code;
      list[idx].toLabel = `${ap.city} (${ap.code})`;
    }
    
    setLegs(list);
    setSuggestions(prev => ({ ...prev, [key]: [] }));
    setActiveInput(null);
  };

  const handleDateChange = (val, idx) => {
    const list = [...legs];
    list[idx].date = val;
    setLegs(list);
  };

  const addLeg = () => {
    setLegs(prev => [...prev, { from: '', fromLabel: '', to: '', toLabel: '', date: '' }]);
  };

  const removeLeg = (idx) => {
    setLegs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Validations
    if (!legs[0].from || !legs[0].to) {
      alert('Please choose valid airports from the autocomplete menu.');
      return;
    }

    if (legs[0].from === legs[0].to) {
      alert('Origin and Destination airports cannot match.');
      return;
    }

    // Save recent search
    const recent = {
      tripType,
      from: legs[0].from,
      to: legs[0].to,
      fromCity: airportList.find(a => a.code === legs[0].from)?.city || legs[0].from,
      toCity: airportList.find(a => a.code === legs[0].to)?.city || legs[0].to,
      date: legs[0].date
    };

    // Prevent duplicates
    const filteredSearches = recentSearches.filter(s => !(s.from === recent.from && s.to === recent.to));
    setRecentSearches([recent, ...filteredSearches].slice(0, 5));

    // Update global state context
    setSearchQuery({
      tripType,
      legs,
      passengers,
      cabinClass,
      returnDate: tripType === 'roundtrip' ? returnDate : ''
    });

    navigate('/search-results');
  };

  return (
    <div className="glass-panel w-full max-w-5xl mx-auto p-6 rounded-2xl">
      {/* Trip Mode Tabs */}
      <div className="flex gap-2 border-b border-slate-200/50 dark:border-slate-800 pb-3 mb-6">
        {['oneway', 'roundtrip', 'multicity'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setTripType(type);
              if (type === 'multicity' && legs.length < 2) {
                setLegs([legs[0], { from: '', fromLabel: '', to: '', toLabel: '', date: '' }]);
              } else if (type !== 'multicity') {
                setLegs([legs[0]]);
              }
            }}
            className={`px-4 py-2 font-medium text-xs rounded-lg uppercase tracking-wider transition-all duration-200 ${
              tripType === type
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-slate-500 hover:text-primary dark:text-slate-400'
            }`}
          >
            {type === 'oneway' ? 'One Way' : type === 'roundtrip' ? 'Round Trip' : 'Multi City'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
        {/* Legs container */}
        <div className="flex flex-col gap-4">
          {legs.map((leg, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row gap-4 items-center">
              {tripType === 'multicity' && (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  Flight {idx + 1}
                </span>
              )}

              {/* Source Airport */}
              <div className="flex-1 w-full relative">
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">From</label>
                  <input
                    type="text"
                    value={leg.fromLabel}
                    onChange={(e) => handleAirportSearch(e.target.value, `from-${idx}`)}
                    onFocus={() => setActiveInput(`from-${idx}`)}
                    placeholder="Departing City/Airport"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                    autoComplete="off"
                  />
                </div>
                {activeInput === `from-${idx}` && suggestions[`from-${idx}`]?.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto mt-1">
                    {suggestions[`from-${idx}`].map(ap => (
                      <div
                        key={ap.code}
                        onClick={() => handleSelectAirport(ap, `from-${idx}`)}
                        className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ap.city}</span>
                          <span className="text-[10px] text-slate-400">{ap.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-primary bg-primary/5 px-2 py-1 rounded">{ap.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Airport */}
              <div className="flex-1 w-full relative">
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">To</label>
                  <input
                    type="text"
                    value={leg.toLabel}
                    onChange={(e) => handleAirportSearch(e.target.value, `to-${idx}`)}
                    onFocus={() => setActiveInput(`to-${idx}`)}
                    placeholder="Arriving City/Airport"
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                    autoComplete="off"
                  />
                </div>
                {activeInput === `to-${idx}` && suggestions[`to-${idx}`]?.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto mt-1">
                    {suggestions[`to-${idx}`].map(ap => (
                      <div
                        key={ap.code}
                        onClick={() => handleSelectAirport(ap, `to-${idx}`)}
                        className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ap.city}</span>
                          <span className="text-[10px] text-slate-400">{ap.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-primary bg-primary/5 px-2 py-1 rounded">{ap.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date */}
              <div className="flex-1 w-full">
                <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Departure Date</label>
                  <input
                    type="date"
                    value={leg.date}
                    onChange={(e) => handleDateChange(e.target.value, idx)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                    required
                  />
                </div>
              </div>

              {/* Multicity Leg Deletion */}
              {tripType === 'multicity' && legs.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeLeg(idx)}
                  className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors md:mt-2"
                  title="Remove this segment"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Multi City - Add segment controls */}
        {tripType === 'multicity' && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={addLeg}
              className="text-xs text-secondary hover:text-primary border border-secondary/20 hover:border-primary/20 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1"
            >
              <span>+</span> Add Another Flight
            </button>
          </div>
        )}

        {/* Dynamic Return Date / Travelers & Cabin Selector Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {tripType === 'roundtrip' && (
            <div className="w-full">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={legs[0]?.date || new Date().toISOString().split('T')[0]}
                  className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                  required={tripType === 'roundtrip'}
                />
              </div>
            </div>
          )}

          <div className="w-full">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Passengers</label>
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="9"
                className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 focus-within:border-primary transition-all">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cabin Class</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-sm outline-none w-full mt-0.5 cursor-pointer"
              >
                <option value="economy">Economy</option>
                <option value="business">Business Class</option>
              </select>
            </div>
          </div>
        </div>

        {/* CTA Search Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-primary text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-4 hover:scale-[1.01]"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
}
