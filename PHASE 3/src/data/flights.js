const airlines = [
  { name: 'IndiGo', code: '6E', rating: 4.2 },
  { name: 'Air India', code: 'AI', rating: 3.9 },
  { name: 'Akasa Air', code: 'QP', rating: 4.1 },
  { name: 'SpiceJet', code: 'SG', rating: 3.8 },
  { name: 'Vistara', code: 'UK', rating: 4.6 }
];

const airports = [
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhash Chandra Bose International Airport' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' }
];

const directDurations = {
  'DEL-BOM': 130, 'BOM-DEL': 130,
  'DEL-BLR': 160, 'BLR-DEL': 160,
  'DEL-CCU': 135, 'CCU-DEL': 135,
  'DEL-HYD': 130, 'HYD-DEL': 130,
  'DEL-MAA': 165, 'MAA-DEL': 165,
  'BOM-BLR': 105, 'BLR-BOM': 105,
  'BOM-CCU': 165, 'CCU-BOM': 165,
  'BOM-HYD': 85,  'HYD-BOM': 85,
  'BOM-MAA': 115, 'MAA-BOM': 115,
  'BLR-CCU': 150, 'CCU-BLR': 150,
  'BLR-HYD': 70,  'HYD-BLR': 70,
  'BLR-MAA': 60,  'MAA-BLR': 60,
  'CCU-HYD': 130, 'HYD-CCU': 130,
  'CCU-MAA': 140, 'MAA-CCU': 140,
  'HYD-MAA': 70,  'MAA-HYD': 70
};

const amenitiesList = [
  ['Wi-Fi', 'In-seat Power', 'USB Port'],
  ['In-seat Power', 'Meal Included', 'Extra Legroom'],
  ['Wi-Fi', 'Meal Included', 'Entertainment System'],
  ['USB Port', 'Extra Legroom', 'Beverages Included'],
  ['In-seat Power', 'USB Port', 'Extra Legroom']
];

const generatedFlights = [];
let idCounter = 1;

for (let i = 0; i < airports.length; i++) {
  for (let j = 0; j < airports.length; j++) {
    if (i === j) continue;
    const fromAp = airports[i];
    const toAp = airports[j];
    const routeKey = `${fromAp.code}-${toAp.code}`;
    const baseDuration = directDurations[routeKey] || 120;

    // Direct Morning
    createFlight(fromAp, toAp, 0, '06:00', baseDuration, 4200);
    // Direct Afternoon
    createFlight(fromAp, toAp, 0, '14:30', baseDuration, 3800);
    // 1-Stop Evening
    const midAirport = airports.find(a => a.code !== fromAp.code && a.code !== toAp.code);
    createFlight(fromAp, toAp, 1, '18:15', baseDuration + 180, 5900, midAirport.code);
    
    // Late Night Direct
    if ((i + j) % 2 === 0) {
      createFlight(fromAp, toAp, 0, '22:45', baseDuration - 5, 3400);
    }
  }
}

function createFlight(fromAp, toAp, stops, depTime, durationMin, basePrice, stopoverAirport = null) {
  const airline = airlines[idCounter % airlines.length];
  const flightNo = `${airline.code}-${100 + idCounter}`;
  
  let price = basePrice;
  if (airline.name === 'Vistara') price += 800;
  if (airline.name === 'Air India') price += 500;
  if (airline.name === 'SpiceJet') price -= 300;
  
  price += (idCounter % 5) * 150 - 300;
  price = Math.round(price / 100) * 100 - 1;

  const [depH, depM] = depTime.split(':').map(Number);
  let arrMinTotal = depH * 60 + depM + durationMin;
  const arrH = Math.floor(arrMinTotal / 60) % 24;
  const arrM = arrMinTotal % 60;
  const arrTime = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;
  
  const rating = (airline.rating + (idCounter % 5) * 0.1 - 0.2).toFixed(1);
  const durH = Math.floor(durationMin / 60);
  const durM = durationMin % 60;
  const durationText = `${durH}h ${durM}m`;

  generatedFlights.push({
    id: `FL${String(idCounter).padStart(3, '0')}`,
    airline: airline.name,
    airlineCode: airline.code,
    flightNumber: flightNo,
    from: fromAp.code,
    fromCity: fromAp.city,
    fromAirport: fromAp.name,
    to: toAp.code,
    toCity: toAp.city,
    toAirport: toAp.name,
    departureTime: depTime,
    arrivalTime: arrTime,
    durationMinutes: durationMin,
    durationText: durationText,
    stops: stops,
    stopover: stopoverAirport,
    price: price,
    rating: parseFloat(rating),
    amenities: amenitiesList[idCounter % amenitiesList.length],
    seatsAvailable: 30 + (idCounter % 15)
  });

  idCounter++;
}

export const flights = generatedFlights;
export const airportList = airports;
export { airlines };
