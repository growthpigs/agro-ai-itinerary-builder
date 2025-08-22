/**
 * Type definitions for the AGRO AI Itinerary Builder
 * These types ensure type safety across the application
 */

// Enum for product categories
export enum ProductCategory {
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits',
  DAIRY = 'dairy',
  MEAT = 'meat',
  EGGS = 'eggs',
  HONEY = 'honey',
  MAPLE = 'maple',
  GRAINS = 'grains',
  HERBS = 'herbs',
  FLOWERS = 'flowers',
  PRESERVES = 'preserves',
  BAKED_GOODS = 'baked-goods'
}

// Enum for farm activities
export enum FarmActivity {
  FARM_STORE = 'farm-store',
  PICK_YOUR_OWN = 'pick-your-own',
  FARM_TOURS = 'farm-tours',
  WORKSHOPS = 'workshops',
  EVENTS = 'events',
  CSA = 'csa',
  FARMERS_MARKET = 'farmers-market'
}

// Location interface
export interface Location {
  lat: number;
  lng: number;
  address: string;
  region: string;
  postalCode?: string;
}

// Operating hours interface
export interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  seasonal?: {
    summer?: string;
    winter?: string;
  };
}

// Contact information interface
export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Accessibility features interface
export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  parkingAvailable: boolean;
  restroomAvailable: boolean;
  assistanceAvailable?: boolean;
  notes?: string;
}

// Seasonal availability interface
export interface SeasonalData {
  spring: string[];
  summer: string[];
  fall: string[];
  winter: string[];
}

// User ratings interface
export interface UserRatings {
  average: number;
  count: number;
  lastUpdated: Date;
}

// Main Producer interface
export interface Producer {
  id: string;
  name: string;
  description: string;
  location: Location;
  categories: ProductCategory[];
  activities: FarmActivity[];
  hours: OperatingHours;
  contact: ContactInfo;
  images: string[];
  seasonalAvailability: SeasonalData;
  accessibility: AccessibilityFeatures;
  ratings?: UserRatings;
  featured?: boolean;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Producer stop in an itinerary
export interface ProducerStop {
  producer: Producer;
  arrivalTime: Date;
  departureTime: Date;
  duration: number; // in minutes
  order: number;
  distance?: number; // distance from previous stop in km
  notes?: string;
}

// User preferences for itinerary generation
export interface UserPreferences {
  categories: ProductCategory[];
  activities: FarmActivity[];
  maxDistance?: number; // in km
  maxDuration?: number; // in hours
  startTime?: Date;
  accessibility?: {
    wheelchairRequired: boolean;
    parkingRequired: boolean;
  };
  avoidHighways?: boolean;
  numberOfStops?: number; // default 3-4
}

// Generated itinerary
export interface Itinerary {
  id: string;
  userId?: string;
  stops: ProducerStop[];
  totalDistance: number; // in km
  estimatedDuration: number; // in minutes
  startLocation: Location;
  endLocation?: Location; // if different from start
  preferences: UserPreferences;
  generatedBy: 'ai' | 'manual';
  shareCode?: string;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: {
    weatherConsiderations?: string;
    seasonalHighlights?: string[];
    aiConfidence?: number;
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
}

// Map route interface
export interface Route {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  steps?: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinates: [number, number];
}