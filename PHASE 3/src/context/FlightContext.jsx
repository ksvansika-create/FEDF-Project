import React, { createContext, useState, useEffect, useContext } from 'react';
import { flights as initialFlights, airportList } from '../data/flights';

const FlightContext = createContext();

export const useFlight = () => useContext(FlightContext);

export const FlightProvider = ({ children }) => {
  // Global App Settings
  const [theme, setTheme] = useState(localStorage.getItem('react-theme') || 'light');
  const [currency, setCurrency] = useState(localStorage.getItem('react-currency') || 'INR');
  const [language, setLanguage] = useState(localStorage.getItem('react-language') || 'EN');
  
  // Dynamic Databases
  const [flights, setFlights] = useState(() => {
    const saved = localStorage.getItem('react-flights-catalog');
    return saved ? JSON.parse(saved) : initialFlights;
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('react-bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  // User Authentication
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('react-user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Toasts stack
  const [notifications, setNotifications] = useState([]);
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState({
    tripType: 'oneway', // 'oneway', 'roundtrip', 'multicity'
    legs: [{ from: '', to: '', date: '' }],
    passengers: 1,
    cabinClass: 'economy',
    returnDate: ''
  });
  
  // Active Booking
  const [bookingSession, setBookingSession] = useState({
    selectedFlight: null,
    selectedReturnFlight: null,
    selectedSeats: [], // Array of seat codes
    passengers: [], // Array of { firstName, lastName, gender, seat }
    contact: { email: '', phone: '' },
    insurance: false,
    promoCode: '',
    discount: 0
  });

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('react-recent-searches');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync settings/databases
  useEffect(() => {
    localStorage.setItem('react-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('react-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('react-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('react-flights-catalog', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem('react-bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('react-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('react-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('react-recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Notifications API helper
  const addNotification = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auth Operations
  const login = (email, password) => {
    // Simulated credentials validation
    if (email && password.length >= 4) {
      const mockName = email.split('@')[0];
      const name = mockName.charAt(0).toUpperCase() + mockName.slice(1);
      setUser({ email, name, role: email.startsWith('admin') ? 'admin' : 'user' });
      addNotification('success', `Welcome back, ${name}!`);
      return true;
    }
    addNotification('error', 'Authentication failed. Please check details.');
    return false;
  };

  const logout = () => {
    setUser(null);
    addNotification('success', 'Logged out successfully.');
  };

  // Admin CRUD for Flights
  const addFlight = (newFlight) => {
    const formatted = {
      ...newFlight,
      id: `FL${String(flights.length + 1).padStart(3, '0')}`,
      price: parseInt(newFlight.price),
      stops: parseInt(newFlight.stops),
      rating: parseFloat(newFlight.rating || 4.2),
      durationMinutes: parseInt(newFlight.durationMinutes || 120),
      durationText: `${Math.floor(newFlight.durationMinutes / 60)}h ${newFlight.durationMinutes % 60}m`,
      amenities: newFlight.amenities || ['Meal Included'],
      seatsAvailable: 45
    };
    
    setFlights(prev => [formatted, ...prev]);
    addNotification('success', `Flight ${formatted.flightNumber} added to schedule.`);
  };

  const deleteFlight = (flightId) => {
    setFlights(prev => prev.filter(f => f.id !== flightId));
    addNotification('success', 'Flight successfully removed from schedule.');
  };

  const updateFlightPrice = (flightId, newPrice) => {
    setFlights(prev => prev.map(f => f.id === flightId ? { ...f, price: parseInt(newPrice) } : f));
    addNotification('success', 'Flight fare updated.');
  };

  // Booking Operations
  const confirmBooking = (bookingData) => {
    setBookings(prev => [bookingData, ...prev]);
    addNotification('success', 'Ticket reservation successfully confirmed!');
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b));
    addNotification('warning', `Booking ${bookingId} has been cancelled.`);
  };

  return (
    <FlightContext.Provider value={{
      theme, setTheme,
      currency, setCurrency,
      language, setLanguage,
      flights, setFlights,
      bookings, setBookings,
      user, setUser,
      login, logout,
      notifications, addNotification, removeNotification,
      searchQuery, setSearchQuery,
      bookingSession, setBookingSession,
      recentSearches, setRecentSearches,
      airportList,
      addFlight, deleteFlight, updateFlightPrice,
      confirmBooking, cancelBooking
    }}>
      {children}
    </FlightContext.Provider>
  );
};
