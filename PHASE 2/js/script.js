// Application State
let appState = {
  theme: localStorage.getItem('flight-theme') || 'light',
  currency: localStorage.getItem('flight-currency') || 'INR',
  language: localStorage.getItem('flight-language') || 'EN',
  flights: [],
  filteredFlights: [],
  recentSearches: JSON.parse(localStorage.getItem('recent-searches')) || [],
  favoriteRoutes: JSON.parse(localStorage.getItem('fav-routes')) || [],
  savedPassengers: JSON.parse(localStorage.getItem('saved-passengers')) || [],
  
  // Active Search Query
  searchQuery: {
    tripType: 'oneway', // 'oneway', 'roundtrip', 'multicity'
    legs: [
      { from: '', to: '', date: '' }
    ],
    passengers: 1,
    cabinClass: 'economy',
    returnDate: ''
  },
  
  // Active Booking Session
  booking: {
    selectedFlight: null,
    selectedReturnFlight: null,
    selectedSeats: [],
    passengers: [],
    contact: { email: '', phone: '' },
    insurance: false,
    promoCode: '',
    discount: 0,
    baseFare: 0,
    taxes: 450,
    totalPrice: 0
  },
  
  currentStep: 1 // 1: Search, 2: Passengers/Seats, 3: Review/Payment, 4: Confirmed
};

// Constants
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€' };
const CURRENCY_RATES = { INR: 1, USD: 0.012, EUR: 0.011 };
const PROMO_CODES = {
  'FLYHIGH20': { type: 'percent', value: 0.20 },
  'WELCOME500': { type: 'flat', value: 500 },
  'SUPERSTEAL': { type: 'percent', value: 0.30 }
};

const AIRPORTS = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi Intl Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda Intl Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhash Chandra Bose Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi Intl Airport' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl Airport' }
];

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadFlights();
  setupEventListeners();
  renderRecentSearches();
  renderFavorites();
  
  // Set default search dates to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  document.getElementById('dep-date-0').value = tomorrowStr;
  document.getElementById('dep-date-0').min = new Date().toISOString().split('T')[0];
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 8);
  document.getElementById('ret-date').value = nextWeek.toISOString().split('T')[0];
  document.getElementById('ret-date').min = tomorrowStr;
});

// Theme Initialization
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = appState.theme === 'dark' 
      ? '<span class="lucide">☀️</span>' 
      : '<span class="lucide">🌙</span>';
  }
}

function toggleTheme() {
  appState.theme = appState.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('flight-theme', appState.theme);
  initTheme();
}

// Currency Conversion & Format helper
function formatCurrency(amount) {
  const rate = CURRENCY_RATES[appState.currency];
  const converted = Math.round(amount * rate);
  const symbol = CURRENCY_SYMBOLS[appState.currency];
  return `${symbol}${converted.toLocaleString(appState.language === 'EN' ? 'en-US' : 'de-DE')}`;
}

// Load Mock Flights Data
async function loadFlights() {
  try {
    const response = await fetch('data/flights.json');
    const data = await response.json();
    appState.flights = data.flights;
  } catch (error) {
    console.error('Error loading flights dataset:', error);
  }
}

// Setup Event Handlers
function setupEventListeners() {
  // Theme change
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  
  // Currency/Language Changes
  document.getElementById('currency-selector').addEventListener('change', (e) => {
    appState.currency = e.target.value;
    localStorage.setItem('flight-currency', appState.currency);
    if (appState.booking.selectedFlight) {
      calculateTotal();
      renderBookingSummary();
    }
    renderFlights();
  });
  
  document.getElementById('language-selector').addEventListener('change', (e) => {
    appState.language = e.target.value;
    localStorage.setItem('flight-language', appState.language);
  });

  // Autocomplete inputs
  setupAutocomplete('from-input-0');
  setupAutocomplete('to-input-0');
  
  // Tab triggers (Oneway, Roundtrip, Multicity)
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      const activeBtn = e.currentTarget;
      activeBtn.classList.add('active');
      setTripType(activeBtn.dataset.type);
    });
  });

  // Multicity Add Leg
  document.getElementById('btn-add-leg').addEventListener('click', addMultiCityLeg);

  // Search Form Submit
  document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerSearch();
  });

  // Sorting Tabs
  const sortTabs = document.querySelectorAll('.sort-tab');
  sortTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      sortTabs.forEach(t => t.classList.remove('active'));
      e.currentTarget.classList.add('active');
      applySorting(e.currentTarget.dataset.sort);
    });
  });

  // Filter input listeners
  document.getElementById('price-range').addEventListener('input', (e) => {
    document.getElementById('price-range-val').innerText = formatCurrency(e.target.value);
    applyFilters();
  });
  
  document.querySelectorAll('.filter-checkbox').forEach(box => {
    box.addEventListener('change', applyFilters);
  });

  // Promo apply button
  document.getElementById('btn-promo-apply').addEventListener('click', applyPromoCode);

  // Modals closure on overlay click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });
}

// Trip type toggler UI setup
function setTripType(type) {
  appState.searchQuery.tripType = type;
  const returnGroup = document.getElementById('ret-date-group');
  const multicityWrapper = document.getElementById('multicity-legs-wrapper');
  const addLegBtn = document.getElementById('btn-add-leg');
  
  if (type === 'roundtrip') {
    returnGroup.style.display = 'flex';
    multicityWrapper.style.display = 'none';
    addLegBtn.style.display = 'none';
  } else if (type === 'oneway') {
    returnGroup.style.display = 'none';
    multicityWrapper.style.display = 'none';
    addLegBtn.style.display = 'none';
  } else if (type === 'multicity') {
    returnGroup.style.display = 'none';
    multicityWrapper.style.display = 'flex';
    addLegBtn.style.display = 'inline-flex';
    
    // Ensure we have at least 2 legs
    const currentRows = multicityWrapper.querySelectorAll('.multicity-row');
    if (currentRows.length === 0) {
      addMultiCityLeg();
      addMultiCityLeg();
    }
  }
}

// Add row for Multi-City Leg
let multicityCounter = 1;
function addMultiCityLeg() {
  const wrapper = document.getElementById('multicity-legs-wrapper');
  const index = multicityCounter++;
  
  const row = document.createElement('div');
  row.className = 'multicity-row';
  row.id = `multicity-row-${index}`;
  
  row.innerHTML = `
    <div class="form-group">
      <label>From</label>
      <input type="text" id="from-input-${index}" placeholder="City or Airport" required>
      <div id="from-input-${index}-suggestions" class="autocomplete-suggestions"></div>
    </div>
    <div class="form-group">
      <label>To</label>
      <input type="text" id="to-input-${index}" placeholder="City or Airport" required>
      <div id="to-input-${index}-suggestions" class="autocomplete-suggestions"></div>
    </div>
    <div class="form-group">
      <label>Departure Date</label>
      <input type="date" id="dep-date-${index}" required>
    </div>
    <button type="button" class="btn-remove-leg" onclick="removeMultiCityLeg(${index})">✕</button>
  `;
  
  wrapper.appendChild(row);
  setupAutocomplete(`from-input-${index}`);
  setupAutocomplete(`to-input-${index}`);
  
  // Set date constraint based on previous row if possible
  const prevDateInput = document.getElementById(`dep-date-${index - 1}`);
  const thisDateInput = document.getElementById(`dep-date-${index}`);
  
  const todayStr = new Date().toISOString().split('T')[0];
  thisDateInput.min = prevDateInput ? prevDateInput.value || todayStr : todayStr;
}

function removeMultiCityLeg(id) {
  const row = document.getElementById(`multicity-row-${id}`);
  if (row) {
    row.remove();
  }
}

// Autocomplete Airport input logic
function setupAutocomplete(inputId) {
  const inputEl = document.getElementById(inputId);
  const suggestionBox = document.getElementById(`${inputId}-suggestions`);
  
  if (!inputEl || !suggestionBox) return;

  inputEl.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    suggestionBox.innerHTML = '';
    
    if (query.length < 1) {
      suggestionBox.style.display = 'none';
      return;
    }
    
    const filtered = AIRPORTS.filter(ap => 
      ap.code.toLowerCase().includes(query) ||
      ap.city.toLowerCase().includes(query) ||
      ap.name.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
      suggestionBox.style.display = 'none';
      return;
    }
    
    filtered.forEach(ap => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <div class="city-name">
          <span>${ap.city}</span>
          <span class="airport-name">${ap.name}</span>
        </div>
        <span class="code-badge">${ap.code}</span>
      `;
      
      item.addEventListener('click', () => {
        inputEl.value = `${ap.city} (${ap.code})`;
        inputEl.dataset.code = ap.code;
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'none';
      });
      
      suggestionBox.appendChild(item);
    });
    
    suggestionBox.style.display = 'block';
  });
  
  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target !== inputEl && e.target !== suggestionBox) {
      suggestionBox.style.display = 'none';
    }
  });
}

// Trigger Flights Search
function triggerSearch() {
  const fromCode = document.getElementById('from-input-0').dataset.code;
  const toCode = document.getElementById('to-input-0').dataset.code;
  
  if (!fromCode || !toCode) {
    alert('Please select origin and destination from the dropdown suggestions.');
    return;
  }
  
  if (fromCode === toCode) {
    alert('Origin and destination cannot be the same.');
    return;
  }
  
  const passengersInput = parseInt(document.getElementById('passengers-count').value);
  const cabinClassInput = document.getElementById('cabin-class').value;
  
  appState.searchQuery.passengers = passengersInput;
  appState.searchQuery.cabinClass = cabinClassInput;
  appState.searchQuery.legs[0] = {
    from: fromCode,
    to: toCode,
    date: document.getElementById('dep-date-0').value
  };

  if (appState.searchQuery.tripType === 'roundtrip') {
    appState.searchQuery.returnDate = document.getElementById('ret-date').value;
  }

  // Save Recent Search
  const recent = {
    tripType: appState.searchQuery.tripType,
    from: fromCode,
    to: toCode,
    fromCity: AIRPORTS.find(a => a.code === fromCode).city,
    toCity: AIRPORTS.find(a => a.code === toCode).city,
    date: appState.searchQuery.legs[0].date
  };
  
  // Keep unique searches
  appState.recentSearches = [recent, ...appState.recentSearches.filter(s => !(s.from === recent.from && s.to === recent.to))].slice(0, 5);
  localStorage.setItem('recent-searches', JSON.stringify(appState.recentSearches));
  renderRecentSearches();

  // Scroll to search results
  document.getElementById('recent-section').style.display = 'none';
  document.getElementById('results-view').style.display = 'grid';
  
  // Run Loading Skeletons
  renderSkeletons();
  
  setTimeout(() => {
    fetchFilteredFlights();
  }, 1000);
}

// Fetch and Filter Logic
function fetchFilteredFlights() {
  const leg = appState.searchQuery.legs[0];
  
  // Match route
  let matching = appState.flights.filter(f => f.from === leg.from && f.to === leg.to);
  
  // Set filter slider max dynamic
  const prices = matching.map(f => f.price);
  if (prices.length > 0) {
    const maxP = Math.max(...prices);
    const minP = Math.min(...prices);
    const slider = document.getElementById('price-range');
    slider.min = minP - 1;
    slider.max = maxP + 1;
    slider.value = maxP;
    document.getElementById('price-range-val').innerText = formatCurrency(maxP);
  }
  
  appState.filteredFlights = matching;
  applyFilters();
}

function applyFilters() {
  const leg = appState.searchQuery.legs[0];
  const maxPrice = parseFloat(document.getElementById('price-range').value);
  
  // Stop filters
  const stopFilters = Array.from(document.querySelectorAll('.filter-stop:checked')).map(cb => parseInt(cb.value));
  
  // Airline filters
  const airlineFilters = Array.from(document.querySelectorAll('.filter-airline:checked')).map(cb => cb.value);

  // Time filters
  const timeFilters = Array.from(document.querySelectorAll('.filter-time:checked')).map(cb => cb.value); // 'morning', 'afternoon', 'evening'
  
  let result = appState.flights.filter(f => f.from === leg.from && f.to === leg.to);

  // Price
  result = result.filter(f => f.price <= maxPrice);

  // Stops
  if (stopFilters.length > 0) {
    result = result.filter(f => stopFilters.includes(f.stops));
  }

  // Airlines
  if (airlineFilters.length > 0) {
    result = result.filter(f => airlineFilters.includes(f.airline));
  }

  // Time
  if (timeFilters.length > 0) {
    result = result.filter(f => {
      const depHour = parseInt(f.departureTime.split(':')[0]);
      let slot = '';
      if (depHour >= 5 && depHour < 12) slot = 'morning';
      else if (depHour >= 12 && depHour < 18) slot = 'afternoon';
      else slot = 'evening';
      return timeFilters.includes(slot);
    });
  }

  appState.filteredFlights = result;
  
  // Re-apply sorting
  const activeSort = document.querySelector('.sort-tab.active').dataset.sort;
  applySorting(activeSort);
}

function applySorting(criteria) {
  if (criteria === 'cheapest') {
    appState.filteredFlights.sort((a, b) => a.price - b.price);
  } else if (criteria === 'fastest') {
    appState.filteredFlights.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (criteria === 'earliest') {
    appState.filteredFlights.sort((a, b) => {
      const timeA = a.departureTime.replace(':', '');
      const timeB = b.departureTime.replace(':', '');
      return parseInt(timeA) - parseInt(timeB);
    });
  } else if (criteria === 'rating') {
    appState.filteredFlights.sort((a, b) => b.rating - a.rating);
  }
  
  renderFlights();
}

// Render Results
function renderFlights() {
  const container = document.getElementById('flights-list');
  container.innerHTML = '';
  
  document.getElementById('results-count-text').innerText = `${appState.filteredFlights.length} Flights Found`;

  if (appState.filteredFlights.length === 0) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 3rem; text-align: center; font-weight: 500; color: var(--text-muted);">
        No flights matching your criteria were found. Try modifying your filters or selection.
      </div>
    `;
    return;
  }

  appState.filteredFlights.forEach(flight => {
    const card = document.createElement('div');
    card.className = 'glass-panel flight-card';
    
    // Class multiplier details
    let finalPrice = flight.price;
    if (appState.searchQuery.cabinClass === 'business') {
      finalPrice = Math.round(flight.price * 2.2);
    }
    
    const airlineColors = {
      'IndiGo': '#0B2B61',
      'Air India': '#E21D26',
      'Akasa Air': '#FF6F00',
      'SpiceJet': '#F52D2D',
      'Vistara': '#4C1542'
    };
    
    const airlineColor = airlineColors[flight.airline] || '#2563EB';
    
    card.innerHTML = `
      <div class="airline-rating">★ ${flight.rating}</div>
      <div class="airline-info">
        <div class="airline-logo-circle" style="background-color: ${airlineColor};">
          ${flight.airlineCode}
        </div>
        <div class="airline-meta">
          <span class="airline-name">${flight.airline}</span>
          <span class="flight-no">${flight.flightNumber}</span>
        </div>
      </div>
      <div class="schedule-info">
        <span class="time">${flight.departureTime}</span>
        <span class="city-code">${flight.from}</span>
      </div>
      <div class="route-progress-bar">
        <span class="duration">${flight.durationText}</span>
        <div class="progress-line">
          <div class="airplane-icon-container">✈️</div>
        </div>
        <span class="stops-count ${flight.stops === 0 ? 'non-stop' : ''}">
          ${flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
        </span>
      </div>
      <div class="schedule-info" style="align-items: flex-start;">
        <span class="time">${flight.arrivalTime}</span>
        <span class="city-code">${flight.to}</span>
      </div>
      <div class="price-booking">
        <span class="price-value">${formatCurrency(finalPrice)}</span>
        <button class="btn-secondary" onclick="bookFlightInit('${flight.id}')">Select</button>
      </div>
    `;
    
    container.appendChild(card);
  });
}

function renderSkeletons() {
  const container = document.getElementById('flights-list');
  container.innerHTML = `
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  `;
}

// Select Flight & Kickstart Booking Flow
function bookFlightInit(flightId) {
  const flight = appState.flights.find(f => f.id === flightId);
  appState.booking.selectedFlight = flight;
  
  // Setup passenger counts and details array
  appState.booking.passengers = [];
  for (let i = 0; i < appState.searchQuery.passengers; i++) {
    appState.booking.passengers.push({
      firstName: '',
      lastName: '',
      gender: 'male',
      seat: ''
    });
  }

  // Set booking step
  appState.currentStep = 2;
  updateStepUI();
  
  // Toggle Page Views
  document.getElementById('hero-section').style.display = 'none';
  document.getElementById('results-view').style.display = 'none';
  document.getElementById('booking-view').style.display = 'block';

  // Build Passenger Inputs HTML
  buildPassengerInputs();
  calculateTotal();
  renderBookingSummary();
}

function buildPassengerInputs() {
  const container = document.getElementById('passengers-forms-container');
  container.innerHTML = '';
  
  appState.booking.passengers.forEach((pass, index) => {
    const block = document.createElement('div');
    block.className = 'passenger-input-block glass-panel';
    block.innerHTML = `
      <div class="passenger-block-title">
        <span>Traveler #${index + 1} (${appState.searchQuery.cabinClass.toUpperCase()})</span>
        <span id="selected-seat-badge-${index}" style="font-size: 0.8rem; color: var(--secondary); font-weight:700;">No Seat Selected</span>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" id="pass-${index}-fname" placeholder="Enter first name" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" id="pass-${index}-lname" placeholder="Enter last name" required>
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select id="pass-${index}-gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <button type="button" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="openSeatSelectionModal(${index})">
        Choose Seat
      </button>
    `;
    container.appendChild(block);
  });
}

// Seat Map Modals Actions
let activePassengerSeatIndex = 0;
function openSeatSelectionModal(passengerIndex) {
  activePassengerSeatIndex = passengerIndex;
  
  const modal = document.getElementById('seat-modal');
  modal.style.display = 'flex';
  
  renderSeatMap();
}

function renderSeatMap() {
  const container = document.getElementById('seat-map-grid');
  container.innerHTML = '';
  
  const isBusiness = appState.searchQuery.cabinClass === 'business';
  const rows = isBusiness ? 5 : 20;
  const startRow = isBusiness ? 1 : 6;
  const seatsLabels = ['A', 'B', 'C', '', 'D', 'E', 'F'];
  
  // Legend
  document.getElementById('seat-legend-container').innerHTML = `
    <div class="legend-item"><div class="legend-color" style="background: var(--seat-avail);"></div>Available</div>
    <div class="legend-item"><div class="legend-color" style="background: var(--seat-occ);"></div>Occupied</div>
    <div class="legend-item"><div class="legend-color" style="background: var(--seat-sel);"></div>Selected</div>
    ${isBusiness ? '<div class="legend-item"><div class="legend-color" style="background: var(--seat-business);"></div>Business</div>' : ''}
  `;

  for (let r = 0; r < rows; r++) {
    const rowNum = startRow + r;
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-grid-row';
    
    seatsLabels.forEach((seatLetter) => {
      if (seatLetter === '') {
        // Aisle space
        const aisle = document.createElement('div');
        aisle.className = 'seat-row-number';
        aisle.innerText = rowNum;
        rowDiv.appendChild(aisle);
        return;
      }
      
      const seatCode = `${rowNum}${seatLetter}`;
      const seatCell = document.createElement('div');
      
      // Check occupied status (simulation)
      const numericVal = parseInt(rowNum) + seatLetter.charCodeAt(0);
      const isOccupied = numericVal % 3 === 0; // Simulated occupied seats
      
      // Check selected status
      const isSelected = appState.booking.selectedSeats.some(s => s.seatCode === seatCode);
      const isThisPassengerSeat = appState.booking.passengers[activePassengerSeatIndex].seat === seatCode;

      seatCell.className = `seat-cell ${isBusiness ? 'business' : 'economy'}`;
      seatCell.innerText = seatCode;
      
      if (isOccupied) {
        seatCell.classList.add('occupied');
      } else {
        if (isSelected) {
          if (isThisPassengerSeat) {
            seatCell.classList.add('selected');
          } else {
            // Already claimed by another traveler in the group
            seatCell.classList.add('occupied');
          }
        }
        
        seatCell.addEventListener('click', () => {
          if (seatCell.classList.contains('occupied')) return;
          selectSeatForActivePassenger(seatCode);
        });
      }
      
      rowDiv.appendChild(seatCell);
    });
    
    container.appendChild(rowDiv);
  }
}

function selectSeatForActivePassenger(seatCode) {
  const previousSeat = appState.booking.passengers[activePassengerSeatIndex].seat;
  
  // Update state
  appState.booking.passengers[activePassengerSeatIndex].seat = seatCode;
  
  // Update selectedSeats global list
  appState.booking.selectedSeats = appState.booking.selectedSeats.filter(s => s.passIndex !== activePassengerSeatIndex);
  appState.booking.selectedSeats.push({ passIndex: activePassengerSeatIndex, seatCode });
  
  // UI indicators
  document.getElementById(`selected-seat-badge-${activePassengerSeatIndex}`).innerText = `Seat: ${seatCode}`;
  
  closeAllModals();
  calculateTotal();
  renderBookingSummary();
}

// Pricing calculation
function calculateTotal() {
  const base = appState.booking.selectedFlight.price;
  const multiplier = appState.searchQuery.cabinClass === 'business' ? 2.2 : 1.0;
  const passCount = appState.searchQuery.passengers;
  
  appState.booking.baseFare = Math.round(base * multiplier * passCount);
  
  // Add seat fee (Business seats +1000, Econ windows/aisles +250)
  let seatFees = 0;
  appState.booking.selectedSeats.forEach(s => {
    const isWinOrAisle = s.seatCode.endsWith('A') || s.seatCode.endsWith('F') || s.seatCode.endsWith('C') || s.seatCode.endsWith('D');
    if (appState.searchQuery.cabinClass === 'business') {
      seatFees += 800;
    } else if (isWinOrAisle) {
      seatFees += 250;
    }
  });

  const insuranceFee = appState.booking.insurance ? 299 * passCount : 0;
  const subtotal = appState.booking.baseFare + seatFees + appState.booking.taxes + insuranceFee;
  
  appState.booking.totalPrice = Math.max(0, subtotal - appState.booking.discount);
}

function renderBookingSummary() {
  document.getElementById('sum-route').innerText = `${appState.booking.selectedFlight.from} → ${appState.booking.selectedFlight.to}`;
  document.getElementById('sum-flight-details').innerText = `${appState.booking.selectedFlight.airline} • ${appState.booking.selectedFlight.flightNumber}`;
  document.getElementById('sum-base').innerText = formatCurrency(appState.booking.baseFare);
  
  let seatFees = 0;
  appState.booking.selectedSeats.forEach(s => {
    const isWinOrAisle = s.seatCode.endsWith('A') || s.seatCode.endsWith('F') || s.seatCode.endsWith('C') || s.seatCode.endsWith('D');
    if (appState.searchQuery.cabinClass === 'business') seatFees += 800;
    else if (isWinOrAisle) seatFees += 250;
  });
  
  document.getElementById('sum-seats').innerText = formatCurrency(seatFees);
  
  const passCount = appState.searchQuery.passengers;
  const insVal = appState.booking.insurance ? 299 * passCount : 0;
  document.getElementById('sum-insurance').innerText = formatCurrency(insVal);
  
  // Discount
  const discRow = document.getElementById('sum-discount-row');
  if (appState.booking.discount > 0) {
    discRow.style.display = 'flex';
    document.getElementById('sum-discount').innerText = `-${formatCurrency(appState.booking.discount)}`;
  } else {
    discRow.style.display = 'none';
  }
  
  document.getElementById('sum-total').innerText = formatCurrency(appState.booking.totalPrice);
}

// Promo code application
function applyPromoCode() {
  const code = document.getElementById('promo-input').value.trim().toUpperCase();
  const msgEl = document.getElementById('promo-message');
  
  if (!code) return;
  
  if (PROMO_CODES[code]) {
    const promo = PROMO_CODES[code];
    let disc = 0;
    if (promo.type === 'percent') {
      disc = Math.round(appState.booking.baseFare * promo.value);
    } else {
      disc = promo.value;
    }
    
    appState.booking.discount = disc;
    appState.booking.promoCode = code;
    
    msgEl.className = 'promo-msg success';
    msgEl.innerText = `Promo applied! You saved ${formatCurrency(disc)}`;
    
    calculateTotal();
    renderBookingSummary();
  } else {
    msgEl.className = 'promo-msg error';
    msgEl.innerText = 'Invalid promo code. Please check and try again.';
  }
}

// Toggle Travel Insurance
function toggleInsurance(checkbox) {
  appState.booking.insurance = checkbox.checked;
  calculateTotal();
  renderBookingSummary();
}

// Proceed from step 2 (passengers) to step 3 (Payment)
function submitPassengersForm(e) {
  e.preventDefault();
  
  // Validate seats selected
  const allSeatsChosen = appState.booking.passengers.every(p => p.seat !== '');
  if (!allSeatsChosen) {
    alert('Please choose a seat for all passengers.');
    return;
  }

  // Populate names from inputs
  appState.booking.passengers.forEach((p, index) => {
    p.firstName = document.getElementById(`pass-${index}-fname`).value;
    p.lastName = document.getElementById(`pass-${index}-lname`).value;
    p.gender = document.getElementById(`pass-${index}-gender`).value;
    
    // Save to favorites database
    const passengerData = { firstName: p.firstName, lastName: p.lastName, gender: p.gender };
    if (!appState.savedPassengers.some(sp => sp.firstName === p.firstName && sp.lastName === p.lastName)) {
      appState.savedPassengers.push(passengerData);
    }
  });
  
  localStorage.setItem('saved-passengers', JSON.stringify(appState.savedPassengers));

  appState.booking.contact.email = document.getElementById('contact-email').value;
  appState.booking.contact.phone = document.getElementById('contact-phone').value;

  // Jump to review step
  appState.currentStep = 3;
  updateStepUI();
  
  // Show Payment Panel
  document.getElementById('booking-forms-section').style.display = 'none';
  document.getElementById('payment-section').style.display = 'block';
}

function processPayment(e) {
  e.preventDefault();
  
  const paymentBtn = document.getElementById('btn-pay-now');
  paymentBtn.innerText = 'Verifying with bank...';
  paymentBtn.disabled = true;
  
  setTimeout(() => {
    // Generate confirmation
    appState.currentStep = 4;
    updateStepUI();
    
    // Show ticket view
    document.getElementById('booking-view').style.display = 'none';
    document.getElementById('confirmation-view').style.display = 'flex';
    
    renderFinalTicket();
  }, 1500);
}

function renderFinalTicket() {
  const pnr = generateRandomPNR();
  const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
  const flight = appState.booking.selectedFlight;
  
  const travelersListText = appState.booking.passengers.map(p => `${p.firstName} ${p.lastName} (${p.seat})`).join(', ');
  
  const ticketHtml = `
    <div class="boarding-pass">
      <div class="boarding-pass-header">
        <div class="pass-airline">
          <div class="pass-logo">${flight.airlineCode}</div>
          <span style="font-weight:600; font-family:'Poppins';">${flight.airline}</span>
        </div>
        <div class="pass-pnr-box">
          <span class="pnr-label">BOARDING PASS PNR</span>
          <span class="pnr-val">${pnr}</span>
        </div>
      </div>
      <div class="boarding-pass-body">
        <div class="pass-route-grid">
          <div class="pass-airport">
            <span class="pass-code">${flight.from}</span>
            <span class="pass-city">${flight.fromCity}</span>
          </div>
          <div style="font-size:1.5rem;">✈️</div>
          <div class="pass-airport" style="align-items:flex-end;">
            <span class="pass-code">${flight.to}</span>
            <span class="pass-city">${flight.toCity}</span>
          </div>
        </div>
        
        <div class="pass-details-grid">
          <div class="pass-item">
            <span class="pass-item-label">FLIGHT</span>
            <span class="pass-item-val">${flight.flightNumber}</span>
          </div>
          <div class="pass-item">
            <span class="pass-item-label">DATE & TIME</span>
            <span class="pass-item-val">${flight.departureTime}</span>
          </div>
          <div class="pass-item">
            <span class="pass-item-label">CLASS</span>
            <span class="pass-item-val">${appState.searchQuery.cabinClass.toUpperCase()}</span>
          </div>
          
          <div class="pass-item">
            <span class="pass-item-label">TRAVELERS</span>
            <span class="pass-item-val" style="grid-column: span 2;">${travelersListText}</span>
          </div>
          <div class="pass-item">
            <span class="pass-item-label">BOOKING ID</span>
            <span class="pass-item-val">${bookingId}</span>
          </div>
        </div>
      </div>
      <div class="boarding-pass-footer">
        <div class="barcode-simulated"></div>
        <div style="font-size:0.75rem; text-align:right; color:var(--text-muted);">
          Gate closes 45m before departure<br><strong>Gate B2</strong>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('ticket-render-target').innerHTML = ticketHtml;
}

function generateRandomPNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

// Step Indicator UI sync
function updateStepUI() {
  for (let s = 1; s <= 3; s++) {
    const indicator = document.getElementById(`step-${s}`);
    if (!indicator) continue;
    
    if (s < appState.currentStep) {
      indicator.className = 'step-item completed';
      indicator.innerHTML = '✓';
    } else if (s === appState.currentStep) {
      indicator.className = 'step-item active';
      indicator.innerHTML = s;
    } else {
      indicator.className = 'step-item';
      indicator.innerHTML = s;
    }
  }
}

// Recent Searches Rendering
function renderRecentSearches() {
  const container = document.getElementById('recent-searches-grid');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (appState.recentSearches.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">No recent searches found.</div>`;
    return;
  }
  
  appState.recentSearches.forEach(search => {
    const card = document.createElement('div');
    card.className = 'glass-panel search-history-card';
    card.innerHTML = `
      <div style="font-size:1.25rem;">🕒</div>
      <div class="history-info">
        <span class="history-route">${search.fromCity} (${search.from}) to ${search.toCity} (${search.to})</span>
        <span class="history-dates">${search.date} • ${search.tripType.toUpperCase()}</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      document.getElementById('from-input-0').value = `${search.fromCity} (${search.from})`;
      document.getElementById('from-input-0').dataset.code = search.from;
      document.getElementById('to-input-0').value = `${search.toCity} (${search.to})`;
      document.getElementById('to-input-0').dataset.code = search.to;
      document.getElementById('dep-date-0').value = search.date;
      setTripType(search.tripType);
      
      const tabBtn = document.querySelector(`.tab-btn[data-type="${search.tripType}"]`);
      if (tabBtn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
      }
      
      triggerSearch();
    });
    
    container.appendChild(card);
  });
}

// Render Favorite Recommendations
function renderFavorites() {
  const container = document.getElementById('recommended-routes-grid');
  if (!container) return;
  
  const recommendations = [
    { from: 'DEL', fromCity: 'Delhi', to: 'BOM', toCity: 'Mumbai', price: 4199 },
    { from: 'BOM', fromCity: 'Mumbai', to: 'BLR', toCity: 'Bengaluru', price: 3499 },
    { from: 'DEL', fromCity: 'Delhi', to: 'BLR', toCity: 'Bengaluru', price: 5899 },
    { from: 'CCU', fromCity: 'Kolkata', to: 'DEL', toCity: 'Delhi', price: 4499 }
  ];
  
  container.innerHTML = '';
  recommendations.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'glass-panel search-history-card';
    card.innerHTML = `
      <div style="font-size:1.25rem; color: var(--accent);">✈️</div>
      <div class="history-info" style="flex: 1;">
        <span class="history-route">${rec.fromCity} to ${rec.toCity}</span>
        <span class="history-dates">Popular Route</span>
      </div>
      <div style="text-align: right;">
        <span style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">${formatCurrency(rec.price)}</span>
        <span style="font-size: 0.65rem; color: var(--text-muted); display: block;">one way</span>
      </div>
    `;
    
    card.addEventListener('click', () => {
      document.getElementById('from-input-0').value = `${rec.fromCity} (${rec.from})`;
      document.getElementById('from-input-0').dataset.code = rec.from;
      document.getElementById('to-input-0').value = `${rec.toCity} (${rec.to})`;
      document.getElementById('to-input-0').dataset.code = rec.to;
      
      // Tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById('dep-date-0').value = tomorrow.toISOString().split('T')[0];
      
      setTripType('oneway');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.tab-btn[data-type="oneway"]').classList.add('active');
      
      triggerSearch();
    });
    
    container.appendChild(card);
  });
}

// Close Modals
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').style = 'display: none';
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.style.display = 'none';
  });
}

// Download/Print Action Simulation
function downloadTicket() {
  window.print();
}

function returnToHome() {
  window.location.reload();
}
