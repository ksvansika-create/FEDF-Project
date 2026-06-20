
AEROJET FLIGHT BOOKING SEARCH ENGINE - PROJECT FLOW

==================================================
1. PROJECT ARCHITECTURE
==================================================

flight-booking-react/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── SearchForm.jsx
│   │   ├── Filters.jsx
│   │   ├── SortBar.jsx
│   │   ├── FlightCard.jsx
│   │   ├── SeatMap.jsx
│   │   ├── BookingSummary.jsx
│   │   ├── TicketCard.jsx
│   │   └── Loader.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── SearchResults.jsx
│   │   ├── Booking.jsx
│   │   ├── Payment.jsx
│   │   ├── Confirmation.jsx
│   │   └── AdminDashboard.jsx
│   │
│   ├── context/
│   │   └── FlightContext.jsx
│   │
│   ├── hooks/
│   │   └── useFlights.js
│   │
│   ├── services/
│   │   └── Flight Service Layer
│   │
│   ├── data/
│   │   └── flights.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── index.html


==================================================
2. EXECUTION FLOW
==================================================

index.html
    ↓
main.jsx
    ↓
App.jsx
    ↓
FlightProvider (Context API)
    ↓
BrowserRouter
    ↓
Navbar + Pages + Footer


==================================================
3. ROLE OF main.jsx
==================================================

Entry point of React application.

Responsibilities:
• Imports React
• Imports App.jsx
• Imports index.css
• Creates React root
• Renders App component

Flow:

main.jsx
   ↓
ReactDOM.createRoot()
   ↓
<App />
   ↓
Application Starts


==================================================
4. ROLE OF App.jsx
==================================================

Central controller of application.

Responsibilities:
• Routing
• Context Provider
• Navbar rendering
• Footer rendering
• Page navigation

Routes:

/                    → Home
/search-results      → Search Results
/booking             → Booking
/payment             → Payment
/confirmation        → Confirmation
/admin               → Admin Dashboard


==================================================
5. COMPLETE USER JOURNEY
==================================================

HOME PAGE
   ↓
Search Flight
   ↓
SEARCH RESULTS PAGE
   ↓
Apply Filters
   ↓
Select Flight
   ↓
BOOKING PAGE
   ↓
Enter Passenger Details
   ↓
Seat Selection
   ↓
PAYMENT PAGE
   ↓
Payment Processing
   ↓
CONFIRMATION PAGE
   ↓
Ticket Generation


==================================================
6. COMPONENT FLOW
==================================================

Home Page
│
├── Navbar
├── Hero
├── SearchForm
└── Footer

Search Results Page
│
├── Navbar
├── Filters
├── SortBar
├── FlightCard
└── Footer

Booking Page
│
├── Passenger Forms
├── SeatMap
├── BookingSummary
└── Footer

Confirmation Page
│
├── TicketCard
└── Booking Summary


==================================================
7. REACT CONCEPTS USED
==================================================

Hooks:
• useState
• useEffect
• useContext

Concepts:
• Components
• Props
• State
• Routing
• Context API
• Conditional Rendering
• Event Handling

Packages:
• React
• React Router DOM
• Tailwind CSS
• Vite


# FEDF-PROJECT
