import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Fuel, Leaf, Users, UsersRound, Route as RouteIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherWidget } from '@/components/WeatherWidget';
import { useItinerary } from '@/hooks/useItinerary';
import { calculateMetrics, formatDuration } from '@/utils/metrics';
import type { Producer } from '@/types';

interface PredefinedTour {
  id: string;
  name: string;
  emoji: string;
  description: string;
  producerIds: string[];
  categories: string[];
  estimatedDistance: number;
  estimatedTime: number;
  fuelConsumption: number;
  carbonFootprint: number;
  familyFriendly: boolean;
  highlights: string[];
}

export const ItineraryBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { clearItinerary, addProducer } = useItinerary();
  const [predefinedTours, setPredefinedTours] = useState<PredefinedTour[]>([]);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [isLargeGroup, setIsLargeGroup] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[ITINERARY] Component mounted, useEffect running');
    // Clear any existing itinerary when landing
    clearItinerary();

    // Load data
    const loadData = async () => {
      try {
        console.log('[ITINERARY] Starting data load...');
        setIsLoading(true);
        
        // DIAGNOSTIC: Log fetch URLs
        const toursUrl = '/data/predefined-tours.json';
        const producersUrl = '/data/producers.json';
        console.log('[ITINERARY] Fetching from:', { toursUrl, producersUrl });
        console.log('[ITINERARY] Current origin:', window.location.origin);
        
        const [toursResponse, producersResponse] = await Promise.all([
          fetch(toursUrl),
          fetch(producersUrl)
        ]);
        
        // DIAGNOSTIC: Detailed response info
        console.log('[ITINERARY] Tours response:', {
          ok: toursResponse.ok,
          status: toursResponse.status,
          statusText: toursResponse.statusText,
          url: toursResponse.url,
          headers: toursResponse.headers.get('content-type')
        });
        
        console.log('[ITINERARY] Producers response:', {
          ok: producersResponse.ok,
          status: producersResponse.status,
          statusText: producersResponse.statusText,
          url: producersResponse.url,
          headers: producersResponse.headers.get('content-type')
        });
        
        if (!toursResponse.ok || !producersResponse.ok) {
          throw new Error(`Failed to fetch data - Tours: ${toursResponse.status}, Producers: ${producersResponse.status}`);
        }
        
        const toursData = await toursResponse.json();
        const producersData = await producersResponse.json();
        
        console.log('[ITINERARY] Data parsed successfully:', { 
          tours: toursData.tours?.length || 0, 
          producers: producersData.producers?.length || 0,
          toursData,
          producersData
        });
        
        setPredefinedTours(toursData.tours || []);
        setProducers(producersData.producers || []);
      } catch (error) {
        console.error('[ITINERARY] Data load failed:', error);
        if (error instanceof Error) {
          console.error('[ITINERARY] Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
        setLoadingError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
        console.log('[ITINERARY] Loading complete');
      }
    };

    loadData();

    // Request location permission
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'pending');
      });
    }
  }, [clearItinerary]);

  const handlePredefinedTour = async (tour: PredefinedTour) => {
    // If location permission not granted, request it
    if (locationPermission === 'pending') {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setLocationPermission('granted');
      } catch {
        setLocationPermission('denied');
      }
    }

    // Clear existing itinerary
    clearItinerary();
    
    // Add the tour's producers to the itinerary
    const tourProducers = producers.filter(p => tour.producerIds.includes(p.id));
    tourProducers.forEach(producer => {
      addProducer(producer);
    });

    // Navigate to the itinerary page
    navigate('/itinerary');
  };

  const handleCustomItinerary = () => {
    navigate('/producers');
  };

  // Add loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  // Add error state
  if (loadingError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <p className="text-muted-foreground">{loadingError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  console.log('Rendering ItineraryBuilder with tours:', predefinedTours.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Plan Your Farm Tour</h1>
            <WeatherWidget />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Create your perfect 3-stop agritourism adventure in Eastern Ontario. 
            Choose from our curated tours or build your own custom itinerary.
          </p>
          
          {/* Group Size Toggle */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Group size:</span>
            <button
              onClick={() => setIsLargeGroup(!isLargeGroup)}
              className="flex items-center gap-2 px-3 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: isLargeGroup ? 'hsl(var(--primary))' : 'transparent',
                color: isLargeGroup ? 'white' : 'inherit',
                borderColor: isLargeGroup ? 'hsl(var(--primary))' : 'hsl(var(--border))'
              }}
            >
              {isLargeGroup ? (
                <>
                  <UsersRound className="h-4 w-4" />
                  <span className="text-sm">Large Group</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Small Group</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Tours */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Start Tours</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {predefinedTours.map((tour) => {
            const metrics = calculateMetrics(tour.estimatedDistance, tour.producerIds.length, isLargeGroup);
            
            return (
              <Card
                key={tour.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePredefinedTour(tour)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{tour.emoji}</span>
                        <span className="text-lg">{tour.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {tour.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{metrics.distance}km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDuration(metrics.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3 w-3 text-muted-foreground" />
                        <span>${metrics.fuelCost.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-muted-foreground" />
                        <span>{metrics.carbon}kg CO₂</span>
                      </div>
                    </div>
                    
                    {/* Stops */}
                    <div className="text-xs text-muted-foreground">
                      {tour.producerIds.length} stops • {tour.familyFriendly ? 'Family friendly' : 'Adults preferred'}
                    </div>
                    
                    {/* CTA */}
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      Start Tour
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Custom Itinerary Options */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6">Create Custom Itinerary</h2>
          <p className="text-muted-foreground mb-6">
            Build your own personalized tour by selecting individual producers or choosing from categories.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCustomItinerary()}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Browse by Producer
                </CardTitle>
                <CardDescription>
                  Choose from all 26 producers, sorted by distance from your location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCustomItinerary()}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-primary" />
                  Browse by Category
                </CardTitle>
                <CardDescription>
                  Select your interests and we'll create the perfect itinerary for you
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};