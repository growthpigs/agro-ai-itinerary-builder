import type { Producer } from '@/types';

interface CategoryItineraryParams {
  selectedCategoryIds: string[];
  producers: Producer[];
  userLocation?: { lat: number; lng: number };
  maxStops?: number;
  maxDistanceKm?: number;
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
  selectedCategoryIds: string[]
): number {
  let score = 0;
  
  // Map category IDs to tag names
  const categoryToTagMap: Record<string, string> = {
    'local-food': 'Local Food',
    'wine-beer-spirits': 'Wine, Beer & Spirits',
    'scenic-location': 'Scenic Location',
    'on-site-activities': 'On-site Activities',
    'artisan-gifts': 'Artisan Gifts',
    'honey-beeswax': 'honey',
    'cafes-eateries': 'Cafés & Eateries'
  };
  
  // Get the tag names for selected categories
  const selectedTags = selectedCategoryIds
    .map(id => categoryToTagMap[id])
    .filter(Boolean);
  
  // Category matching score (primary factor)
  let categoryMatches = producer.tags?.filter(tag => 
    selectedTags.includes(tag)
  ).length || 0;
  
  // Special case: if honey-beeswax is selected and producer has honey in categories
  const honeySelected = selectedCategoryIds.includes('honey-beeswax');
  if (honeySelected && producer.categories?.includes('honey')) {
    categoryMatches += 1;
  }
  
  // Special case: if cafes-eateries is selected and producer has restaurant/catering in categories
  const cafesSelected = selectedCategoryIds.includes('cafes-eateries');
  if (cafesSelected && producer.categories?.some(cat => 
    ['restaurant', 'catering', 'cafe', 'bistro', 'eatery'].includes(cat)
  )) {
    categoryMatches += 1;
  }
  
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
  
  // Note: We no longer penalize based on distance from user
  // since users might be planning from anywhere in the world
  
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
  maxStops = 5,
  maxDistanceKm = 100
}: CategoryItineraryParams): CategoryItineraryResult {
  
  console.log('[CategoryItinerary] Building itinerary:', {
    selectedCategoryIds,
    totalProducers: producers.length,
    userLocation,
    maxStops
  });
  
  // Map category IDs to tag names
  const categoryToTagMap: Record<string, string> = {
    'local-food': 'Local Food',
    'wine-beer-spirits': 'Wine, Beer & Spirits',
    'scenic-location': 'Scenic Location',
    'on-site-activities': 'On-site Activities',
    'artisan-gifts': 'Artisan Gifts',
    'honey-beeswax': 'honey',
    'cafes-eateries': 'Cafés & Eateries'
  };
  
  // Get the tag names for selected categories
  const selectedTags = selectedCategoryIds
    .map(id => categoryToTagMap[id])
    .filter(Boolean);
  
  // Filter producers that match at least one selected category tag
  // Special handling for honey category since it's not in tags but in categories
  let matchingProducers = producers.filter(producer => {
    // Check if producer has matching tags
    const hasMatchingTag = producer.tags?.some(tag => selectedTags.includes(tag));
    
    // Special case: if honey-beeswax is selected, also check categories field
    const honeySelected = selectedCategoryIds.includes('honey-beeswax');
    const isHoneyProducer = honeySelected && producer.categories?.includes('honey');
    
    // Special case: if cafes-eateries is selected, check for restaurant/catering categories
    const cafesSelected = selectedCategoryIds.includes('cafes-eateries');
    const isCafeEatery = cafesSelected && producer.categories?.some(cat => 
      ['restaurant', 'catering', 'cafe', 'bistro', 'eatery'].includes(cat)
    );
    
    return hasMatchingTag || isHoneyProducer || isCafeEatery;
  });
  
  // Note: We don't filter by distance from user location anymore
  // Users might be planning trips from anywhere in the world!
  
  console.log('[CategoryItinerary] Matching producers:', matchingProducers.length);
  
  if (matchingProducers.length === 0) {
    return {
      selectedProducers: [],
      reasoning: 'No producers found matching the selected categories. Try selecting different categories or combinations.',
      categoryBreakdown: {}
    };
  }
  
  // Score and sort producers
  const scoredProducers = matchingProducers.map(producer => ({
    producer,
    score: scoreProducer(producer, selectedCategoryIds)
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
    
    const tagName = categoryToTagMap[categoryId];
    const bestForCategory = scoredProducers.find(sp => {
      // Check tags
      const hasTag = sp.producer.tags?.includes(tagName);
      
      // Special case for honey
      const isHoneyCategory = categoryId === 'honey-beeswax';
      const isHoneyProducer = isHoneyCategory && sp.producer.categories?.includes('honey');
      
      // Special case for cafes
      const isCafeCategory = categoryId === 'cafes-eateries';
      const isCafeProducer = isCafeCategory && sp.producer.categories?.some(cat => 
        ['restaurant', 'catering', 'cafe', 'bistro', 'eatery'].includes(cat)
      );
      
      return (hasTag || isHoneyProducer || isCafeProducer) && !selectedProducers.includes(sp.producer);
    });
    
    if (bestForCategory) {
      selectedProducers.push(bestForCategory.producer);
      // Update category breakdown based on tags
      selectedCategoryIds.forEach(catId => {
        const tag = categoryToTagMap[catId];
        if (bestForCategory.producer.tags?.includes(tag)) {
          categoryBreakdown[catId]++;
        }
      });
    }
  }
  
  // Second pass: fill remaining slots with highest scoring producers
  // Ensure that the total route is geographically reasonable
  for (const { producer } of scoredProducers) {
    if (selectedProducers.length >= maxStops) break;
    if (!selectedProducers.includes(producer)) {
      // Check if adding this producer keeps the route reasonable
      let isReasonableAddition = true;
      
      if (selectedProducers.length > 0) {
        // Check distance from ALL selected producers to ensure geographic clustering
        const distances = selectedProducers.map(selected => 
          calculateDistance(
            selected.location.lat,
            selected.location.lng,
            producer.location.lat,
            producer.location.lng
          )
        );
        
        // If any producer is more than maxDistanceKm away, skip
        if (distances.some(d => d > maxDistanceKm)) {
          isReasonableAddition = false;
        }
      }
      
      if (isReasonableAddition) {
        selectedProducers.push(producer);
        // Update category breakdown based on tags
        selectedCategoryIds.forEach(catId => {
          const tag = categoryToTagMap[catId];
          if (producer.tags?.includes(tag)) {
            categoryBreakdown[catId]++;
          }
        });
      }
    }
  }
  
  // Generate reasoning
  const categoryNames = selectedCategoryIds.map(id => {
    const categoryMap: Record<string, string> = {
      'local-food': 'Local Food',
      'wine-beer-spirits': 'Wine, Beer & Spirits',
      'scenic-location': 'Scenic Location',
      'on-site-activities': 'On-site Activities',
      'artisan-gifts': 'Artisan Gifts',
      'honey-beeswax': 'honey',
      'cafes-eateries': 'Caf\u00e9s & Eateries'
    };
    return categoryMap[id] || id;
  }).join(', ');
  
  let reasoning = `Selected ${selectedProducers.length} producers based on your interest in ${categoryNames}. `;
  reasoning += `The route is optimized to keep travel distances reasonable (stops within ${maxDistanceKm}km of each other) while ensuring good category coverage.`;
  
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
  // Map category IDs to tag names
  const categoryToTagMap: Record<string, string> = {
    'local-food': 'Local Food',
    'wine-beer-spirits': 'Wine, Beer & Spirits',
    'scenic-location': 'Scenic Location',
    'on-site-activities': 'On-site Activities',
    'artisan-gifts': 'Artisan Gifts',
    'honey-beeswax': 'honey',
    'cafes-eateries': 'Cafés & Eateries'
  };
  
  // Get the tag names for selected categories
  const selectedTags = selectedCategoryIds
    .map(id => categoryToTagMap[id])
    .filter(Boolean);
  
  const matchingProducers = producers.filter(producer => {
    // Check if producer has matching tags
    const hasMatchingTag = producer.tags?.some(tag => selectedTags.includes(tag));
    
    // Special case: if honey-beeswax is selected, also check categories field
    const honeySelected = selectedCategoryIds.includes('honey-beeswax');
    const isHoneyProducer = honeySelected && producer.categories?.includes('honey');
    
    // Special case: if cafes-eateries is selected, check for restaurant/catering categories
    const cafesSelected = selectedCategoryIds.includes('cafes-eateries');
    const isCafeEatery = cafesSelected && producer.categories?.some(cat => 
      ['restaurant', 'catering', 'cafe', 'bistro', 'eatery'].includes(cat)
    );
    
    return hasMatchingTag || isHoneyProducer || isCafeEatery;
  });
  
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