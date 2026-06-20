import { useState, useEffect } from 'react';
import { useFlight } from '../context/FlightContext';
import { filterFlights, sortFlights } from '../services/flightService';

export const useFlights = () => {
  const { flights, searchQuery } = useFlight();
  const leg = searchQuery.legs[0]; // Primary leg
  
  // local filter criteria
  const [filterCriteria, setFilterCriteria] = useState({
    maxPrice: 25000,
    stops: [],
    airlines: [],
    departureTimeSlots: []
  });
  
  // local sort criteria
  const [sortType, setSortType] = useState('cheapest');
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  // Reset filter constraints dynamically when route details change
  useEffect(() => {
    if (!leg.from || !leg.to) return;
    
    // Find absolute pricing limits on the route to set initial limits
    const routeFlights = flights.filter(f => f.from === leg.from && f.to === leg.to);
    if (routeFlights.length > 0) {
      const prices = routeFlights.map(f => f.price);
      const maxP = Math.max(...prices);
      setFilterCriteria(prev => ({
        ...prev,
        maxPrice: maxP,
        stops: [],
        airlines: [],
        departureTimeSlots: []
      }));
    }
  }, [leg.from, leg.to, flights]);

  // Handle filtering/sorting logic
  useEffect(() => {
    if (!leg.from || !leg.to) return;
    
    setLoading(true);
    const delay = setTimeout(() => {
      const criteria = {
        ...filterCriteria,
        from: leg.from,
        to: leg.to
      };
      
      const filtered = filterFlights(flights, criteria);
      const sorted = sortFlights(filtered, sortType);
      
      setFilteredResults(sorted);
      setLoading(false);
    }, 600); // Simulated delay for visual skeleton screens

    return () => clearTimeout(delay);
  }, [filterCriteria, sortType, leg.from, leg.to, flights]);

  return {
    filteredResults,
    filterCriteria,
    setFilterCriteria,
    sortType,
    setSortType,
    loading
  };
};
