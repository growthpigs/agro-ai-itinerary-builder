import type { Producer } from '@/types';

interface CategoryItineraryParams {
  selectedCategoryIds: string[];
  producers: Producer[];
  userLocation?: { lat: number; lng: number };
  maxStops?: number;
}

interface CategoryItineraryResult {
  selectedProducers: Producer[];
  reasoning: string;
  categoryBreakdown: Record<string, number>;
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Score a producer based on category match and other factors
 */
function scoreProducer(
  producer: Producer, 
  selectedCategoryIds: string[], 
  userLocation?: { lat: number; lng: number }
): number {
  let score = 0;
  
  // Category matching score (primary factor)
  const categoryMatches = producer.categories.filter(cat => 
    selectedCategoryIds.includes(cat)
  ).length;
  score += categoryMatches * 100; // Each matching category = 100 points
  
  // Bonus for multiple category matches (diversity)
  if (categoryMatches > 1) {
    score += categoryMatches * 20; // Bonus for being multi-category
  }
  
  // Featured producer bonus
  if (producer.featured) {
    score += 30;
  }
  
  // Activity variety bonus
  if (producer.activities.length > 2) {
    score += 15;
  }
  
  // Distance penalty (if user location available)
  if (userLocation) {
    const distance = calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      producer.location.lat, 
      producer.location.lng
    );
    // Penalty increases with distance (up to 50km)
    const distancePenalty = Math.min(distance * 2, 100);
    score -= distancePenalty;
  }
  
  // Seasonal availability bonus (rough estimate)
  if (producer.seasonal && producer.seasonal.toLowerCase().includes('year-round')) {
    score += 10;
  }
  
  return Math.max(score, 0); // Ensure non-negative
}

/**
 * Build an itinerary based on selected categories
 */
export function buildCategoryItinerary({
  selectedCategoryIds,
  producers,
  userLocation,
  maxStops = 5
}: CategoryItineraryParams): CategoryItineraryResult {
  
  console.log('[CategoryItinerary] Building itinerary:', {
    selectedCategoryIds,
    totalProducers: producers.length,
    userLocation,
    maxStops
  });
  
  // Filter producers that match at least one selected category
  const matchingProducers = producers.filter(producer =>
    producer.categories.some(cat => selectedCategoryIds.includes(cat))
  );
  
  console.log('[CategoryItinerary] Matching producers:', matchingProducers.length);
  
  if (matchingProducers.length === 0) {
    return {
      selectedProducers: [],
      reasoning: 'No producers found matching the selected categories.',
      categoryBreakdown: {}
    };
  }
  
  // Score and sort producers
  const scoredProducers = matchingProducers.map(producer => ({
    producer,
    score: scoreProducer(producer, selectedCategoryIds, userLocation)
  })).sort((a, b) => b.score - a.score);
  
  console.log('[CategoryItinerary] Top scored producers:', 
    scoredProducers.slice(0, 10).map(sp => ({ 
      name: sp.producer.name, 
      score: sp.score, 
      categories: sp.producer.categories 
    }))
  );
  
  // Select top producers, ensuring category diversity
  const selectedProducers: Producer[] = [];
  const categoryBreakdown: Record<string, number> = {};
  
  // Initialize category breakdown
  selectedCategoryIds.forEach(cat => {
    categoryBreakdown[cat] = 0;
  });
  
  // First pass: select one producer per category to ensure coverage
  for (const categoryId of selectedCategoryIds) {
    if (selectedProducers.length >= maxStops) break;
    
    const bestForCategory = scoredProducers.find(sp => 
      sp.producer.categories.includes(categoryId) &&
      !selectedProducers.includes(sp.producer)
    );
    
    if (bestForCategory) {
      selectedProducers.push(bestForCategory.producer);
      bestForCategory.producer.categories.forEach(cat => {
        if (selectedCategoryIds.includes(cat)) {
          categoryBreakdown[cat]++;
        }
      });
    }
  }
  
  // Second pass: fill remaining slots with highest scoring producers
  for (const { producer } of scoredProducers) {
    if (selectedProducers.length >= maxStops) break;
    if (!selectedProducers.includes(producer)) {
      selectedProducers.push(producer);
      producer.categories.forEach(cat => {
        if (selectedCategoryIds.includes(cat)) {
          categoryBreakdown[cat]++;
        }
      });
    }
  }
  
  // Generate reasoning
  const categoryNames = selectedCategoryIds.map(id => {
    const categoryMap: Record<string, string> = {
      'vegetables': 'Fresh Vegetables',
      'fruits': 'Fruits & Berries', 
      'dairy': 'Dairy Products',
      'meat': 'Meat & Poultry',
      'maple': 'Maple Products',
      'honey': 'Honey & Beeswax',
      'artisan': 'Artisan Crafts',
      'beverages': 'Beverages',
      'bakery': 'Baked Goods'
    };
    return categoryMap[id] || id;
  }).join(', ');
  
  const reasoning = `Selected ${selectedProducers.length} producers based on your interest in ${categoryNames}. ` +
    `The itinerary balances category coverage, producer quality, and geographic proximity${userLocation ? ' to your location' : ''}.`;
  
  console.log('[CategoryItinerary] Final selection:', {
    count: selectedProducers.length,
    categoryBreakdown,
    reasoning
  });
  
  return {
    selectedProducers,
    reasoning,
    categoryBreakdown
  };
}

/**
 * Check if there are enough producers for the selected categories
 */
export function validateCategorySelection(
  selectedCategoryIds: string[], 
  producers: Producer[],
  minProducers: number = 3
): { isValid: boolean; message: string } {
  const matchingProducers = producers.filter(producer =>
    producer.categories.some(cat => selectedCategoryIds.includes(cat))
  );
  
  if (matchingProducers.length < minProducers) {
    return {
      isValid: false,
      message: `Only ${matchingProducers.length} producers available for selected categories. Try selecting more categories or different combinations.`
    };
  }
  
  return {
    isValid: true,
    message: `${matchingProducers.length} producers available for your selections.`
  };
}