import OpenAI from 'openai';
import { Producer, UserPreferences, Itinerary, ProducerStop } from '@/types/producer.types';
import { calculateDistance } from '@/lib/geo/distance';

/**
 * AI-powered itinerary generation for AGRO AI Itinerary Builder
 * Uses OpenAI to intelligently match producers with user preferences
 */

interface GeneratorConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxRetries?: number;
}

export class ItineraryGenerator {
  private openai: OpenAI;
  private config: Required<GeneratorConfig>;

  constructor(config: GeneratorConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model || 'gpt-4-turbo-preview',
      temperature: config.temperature || 0.7,
      maxRetries: config.maxRetries || 3
    };

    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: process.env.NODE_ENV === 'development' // Only for dev
    });
  }

  /**
   * Generate an optimized itinerary based on user preferences
   * @param producers - Available producers in the region
   * @param preferences - User's preferences and constraints
   * @param startLocation - Starting location coordinates
   * @returns Generated itinerary with 3-4 stops
   */
  async generateItinerary(
    producers: Producer[],
    preferences: UserPreferences,
    startLocation: { lat: number; lng: number }
  ): Promise<Itinerary> {
    try {
      // Filter producers based on basic criteria
      const eligibleProducers = this.filterProducers(producers, preferences);
      
      if (eligibleProducers.length < 3) {
        throw new Error('Not enough producers match your criteria');
      }

      // Create context for AI
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(
        eligibleProducers,
        preferences,
        startLocation
      );

      // Get AI recommendations
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: this.config.temperature,
        response_format: { type: 'json_object' }
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      // Build itinerary from AI response
      const itinerary = await this.buildItinerary(
        aiResponse,
        eligibleProducers,
        preferences,
        startLocation
      );

      return itinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Fallback to simple algorithm
      return this.generateFallbackItinerary(
        producers,
        preferences,
        startLocation
      );
    }
  }

  /**
   * Filter producers based on user preferences
   */
  private filterProducers(
    producers: Producer[],
    preferences: UserPreferences
  ): Producer[] {
    return producers.filter(producer => {
      // Check categories match
      const hasMatchingCategory = producer.categories.some(cat =>
        preferences.categories.includes(cat)
      );
      
      // Check activities match
      const hasMatchingActivity = producer.activities.some(act =>
        preferences.activities.includes(act)
      );

      // Check accessibility
      if (preferences.accessibility?.wheelchairRequired &&
          !producer.accessibility.wheelchairAccessible) {
        return false;
      }

      return hasMatchingCategory || hasMatchingActivity;
    });
  }

  /**
   * Create system prompt for AI
   */
  private createSystemPrompt(): string {
    return `You are an expert agricultural tourism planner for Eastern Ontario. 
    Your task is to create optimal itineraries that:
    1. Showcase diverse agricultural experiences
    2. Minimize driving distance while maximizing enjoyment
    3. Consider seasonal availability and operating hours
    4. Match user preferences precisely
    5. Create a logical flow between stops (e.g., morning coffee, lunch spot, afternoon activity)
    
    Respond with a JSON object containing:
    {
      "selectedProducers": ["id1", "id2", "id3"],
      "reasoning": "Brief explanation of choices",
      "highlights": ["highlight1", "highlight2"],
      "tips": "Seasonal or timing tips"
    }`;
  }

  /**
   * Create user prompt with context
   */
  private createUserPrompt(
    producers: Producer[],
    preferences: UserPreferences,
    startLocation: { lat: number; lng: number }
  ): string {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentSeason = this.getCurrentSeason();

    return `Create an itinerary for a user starting at coordinates ${startLocation.lat}, ${startLocation.lng}.
    
    User Preferences:
    - Categories: ${preferences.categories.join(', ')}
    - Activities: ${preferences.activities.join(', ')}
    - Maximum distance: ${preferences.maxDistance || 100}km
    - Duration: ${preferences.maxDuration || 4} hours
    ${preferences.accessibility?.wheelchairRequired ? '- Wheelchair accessibility required' : ''}
    
    Current Time Context:
    - Month: ${currentMonth}
    - Season: ${currentSeason}
    
    Available Producers:
    ${producers.map(p => `
    ID: ${p.id}
    Name: ${p.name}
    Description: ${p.description}
    Categories: ${p.categories.join(', ')}
    Activities: ${p.activities.join(', ')}
    Seasonal Availability: ${p.seasonalAvailability[currentSeason].join(', ')}
    `).join('\n')}
    
    Select 3-4 producers that create the best possible experience.`;
  }

  /**
   * Build itinerary from AI response
   */
  private async buildItinerary(
    aiResponse: {
      selectedProducers: string[];
      reasoning: string;
      highlights: string[];
      tips: string;
    },
    producers: Producer[],
    preferences: UserPreferences,
    startLocation: { lat: number; lng: number }
  ): Promise<Itinerary> {
    const selectedProducers = producers.filter(p =>
      aiResponse.selectedProducers.includes(p.id)
    );

    // Calculate optimal route
    const route = await this.optimizeRoute(selectedProducers, startLocation);
    
    // Create stops with timing
    const stops: ProducerStop[] = route.map((producer, index) => ({
      producer,
      order: index + 1,
      arrivalTime: this.calculateArrivalTime(index, preferences.startTime),
      departureTime: this.calculateDepartureTime(index, preferences.startTime),
      duration: 45, // 45 minutes per stop
      distance: index === 0 
        ? calculateDistance(startLocation, producer.location)
        : calculateDistance(route[index - 1].location, producer.location)
    }));

    const totalDistance = stops.reduce((sum, stop) => sum + (stop.distance || 0), 0);
    const returnDistance = calculateDistance(
      route[route.length - 1].location,
      startLocation
    );

    return {
      id: this.generateId(),
      stops,
      totalDistance: totalDistance + returnDistance,
      estimatedDuration: stops.length * 45 + (totalDistance + returnDistance) * 1.5, // 1.5 min/km
      startLocation: {
        lat: startLocation.lat,
        lng: startLocation.lng,
        address: 'Starting location',
        region: 'Eastern Ontario'
      },
      preferences,
      generatedBy: 'ai',
      createdAt: new Date(),
      metadata: {
        aiConfidence: 0.85,
        seasonalHighlights: aiResponse.highlights,
        weatherConsiderations: aiResponse.tips
      }
    };
  }

  /**
   * Optimize route using nearest neighbor algorithm
   */
  private async optimizeRoute(
    producers: Producer[],
    startLocation: { lat: number; lng: number }
  ): Promise<Producer[]> {
    const route: Producer[] = [];
    const remaining = [...producers];
    let currentLocation = startLocation;

    while (remaining.length > 0) {
      // Find nearest producer
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      remaining.forEach((producer, index) => {
        const distance = calculateDistance(currentLocation, producer.location);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      const nearest = remaining.splice(nearestIndex, 1)[0];
      route.push(nearest);
      currentLocation = nearest.location;
    }

    return route;
  }

  /**
   * Fallback itinerary generation without AI
   */
  private generateFallbackItinerary(
    producers: Producer[],
    preferences: UserPreferences,
    startLocation: { lat: number; lng: number }
  ): Itinerary {
    // Simple algorithm: pick closest matching producers
    const filtered = this.filterProducers(producers, preferences);
    const sorted = filtered.sort((a, b) => {
      const distA = calculateDistance(startLocation, a.location);
      const distB = calculateDistance(startLocation, b.location);
      return distA - distB;
    });

    const selected = sorted.slice(0, 4);
    const optimized = this.optimizeRoute(selected, startLocation);

    // Build basic itinerary
    const stops: ProducerStop[] = optimized.map((producer, index) => ({
      producer,
      order: index + 1,
      arrivalTime: this.calculateArrivalTime(index, preferences.startTime),
      departureTime: this.calculateDepartureTime(index, preferences.startTime),
      duration: 45,
      distance: index === 0
        ? calculateDistance(startLocation, producer.location)
        : calculateDistance(optimized[index - 1].location, producer.location)
    }));

    const totalDistance = stops.reduce((sum, stop) => sum + (stop.distance || 0), 0);

    return {
      id: this.generateId(),
      stops,
      totalDistance,
      estimatedDuration: stops.length * 45 + totalDistance * 1.5,
      startLocation: {
        lat: startLocation.lat,
        lng: startLocation.lng,
        address: 'Starting location',
        region: 'Eastern Ontario'
      },
      preferences,
      generatedBy: 'manual',
      createdAt: new Date()
    };
  }

  /**
   * Helper methods
   */
  private getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  private calculateArrivalTime(stopIndex: number, startTime?: Date): Date {
    const start = startTime || new Date();
    const hoursToAdd = stopIndex * 1.5; // 1.5 hours per stop including travel
    return new Date(start.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  private calculateDepartureTime(stopIndex: number, startTime?: Date): Date {
    const arrival = this.calculateArrivalTime(stopIndex, startTime);
    return new Date(arrival.getTime() + 45 * 60 * 1000); // 45 minutes at each stop
  }

  private generateId(): string {
    return `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}