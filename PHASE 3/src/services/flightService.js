export const filterFlights = (flights, criteria) => {
  const { maxPrice, stops, airlines, departureTimeSlots, from, to } = criteria;
  let result = flights;

  // Filter by search route
  if (from) {
    result = result.filter(f => f.from === from);
  }
  if (to) {
    result = result.filter(f => f.to === to);
  }

  // Filter by Max Price
  if (maxPrice) {
    result = result.filter(f => f.price <= maxPrice);
  }

  // Filter by Stops
  if (stops && stops.length > 0) {
    result = result.filter(f => stops.includes(f.stops));
  }

  // Filter by Airlines
  if (airlines && airlines.length > 0) {
    result = result.filter(f => airlines.includes(f.airline));
  }

  // Filter by Departure Time Slot
  if (departureTimeSlots && departureTimeSlots.length > 0) {
    result = result.filter(f => {
      const depHour = parseInt(f.departureTime.split(':')[0], 10);
      let slot = '';
      if (depHour >= 5 && depHour < 12) slot = 'morning';
      else if (depHour >= 12 && depHour < 18) slot = 'afternoon';
      else slot = 'evening';
      return departureTimeSlots.includes(slot);
    });
  }

  return result;
};

export const sortFlights = (flights, sortType) => {
  const sorted = [...flights];
  switch (sortType) {
    case 'cheapest':
      return sorted.sort((a, b) => a.price - b.price);
    case 'fastest':
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'earliest':
      return sorted.sort((a, b) => {
        const timeA = parseInt(a.departureTime.replace(':', ''), 10);
        const timeB = parseInt(b.departureTime.replace(':', ''), 10);
        return timeA - timeB;
      });
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};
