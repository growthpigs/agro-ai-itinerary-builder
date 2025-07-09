export interface Producer {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  categories: string[];
  activities: string[];
  hours: string;
  phone?: string;
  website?: string;
  email?: string;
  image: string;
  seasonal: string;
  featured?: boolean;
  tags?: string[];
}

export interface Itinerary {
  id: string;
  producerIds: string[];
  createdAt: Date;
  name?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export type ProducerCategory = 
  | 'vegetables'
  | 'fruits' 
  | 'dairy'
  | 'meat'
  | 'eggs'
  | 'honey'
  | 'maple'
  | 'grains'
  | 'herbs'
  | 'flowers'
  | 'preserves'
  | 'baked-goods';

export type FarmActivity = 
  | 'farm-store'
  | 'pick-your-own'
  | 'farm-tours'
  | 'workshops'
  | 'events'
  | 'csa'
  | 'farmers-market';

export const CATEGORY_LABELS: Record<ProducerCategory, string> = {
  'vegetables': 'Vegetables',
  'fruits': 'Fruits',
  'dairy': 'Dairy',
  'meat': 'Meat',
  'eggs': 'Eggs', 
  'honey': 'Honey',
  'maple': 'Maple Products',
  'grains': 'Grains',
  'herbs': 'Herbs',
  'flowers': 'Flowers',
  'preserves': 'Preserves',
  'baked-goods': 'Baked Goods'
};

export const ACTIVITY_LABELS: Record<FarmActivity, string> = {
  'farm-store': 'Farm Store',
  'pick-your-own': 'Pick Your Own',
  'farm-tours': 'Farm Tours',
  'workshops': 'Workshops',
  'events': 'Events',
  'csa': 'CSA',
  'farmers-market': 'Farmers Market'
};