// Metric calculations for itineraries

export interface ItineraryMetrics {
  distance: number; // km
  duration: number; // minutes
  fuel: number; // liters
  fuelCost: number; // CAD
  carbon: number; // kg CO2
}

const FUEL_PRICE_PER_LITER = 1.50; // CAD
const AVERAGE_FUEL_CONSUMPTION = 9.0; // L/100km (average car)
const CO2_PER_LITER = 2.3; // kg CO2 per liter of gasoline
const AVERAGE_RURAL_SPEED = 65; // km/h
const STOP_TIME_MINUTES = 45; // minutes per stop
const COUNTRYSIDE_FACTOR = 1.15; // 15% extra time for rural driving

export function calculateMetrics(
  distance: number,
  numberOfStops: number,
  isLargeGroup: boolean = false
): ItineraryMetrics {
  // Add time factor for larger groups
  const groupFactor = isLargeGroup ? 1.2 : 1.0;
  
  // Calculate driving time
  const drivingTime = (distance / AVERAGE_RURAL_SPEED) * 60 * COUNTRYSIDE_FACTOR;
  
  // Calculate total time including stops
  const stopTime = numberOfStops * STOP_TIME_MINUTES * groupFactor;
  const totalDuration = Math.round(drivingTime + stopTime);
  
  // Calculate fuel consumption
  const fuel = (distance / 100) * AVERAGE_FUEL_CONSUMPTION;
  const fuelCost = fuel * FUEL_PRICE_PER_LITER;
  
  // Calculate carbon footprint
  const carbon = fuel * CO2_PER_LITER;
  
  return {
    distance: Math.round(distance),
    duration: totalDuration,
    fuel: Math.round(fuel * 10) / 10, // Round to 1 decimal
    fuelCost: Math.round(fuelCost * 100) / 100, // Round to 2 decimals
    carbon: Math.round(carbon * 10) / 10 // Round to 1 decimal
  };
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
}