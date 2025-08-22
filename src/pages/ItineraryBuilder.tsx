import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Fuel, Leaf, Users, UsersRound, Route as RouteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherWidget } from '@/components/WeatherWidget';
import { useItinerary } from '@/hooks/useItinerary';
import { calculateMetrics, formatDuration } from '@/utils/metrics';
import { ProducerImage } from '@/components/ui/ProducerImage';
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
  }, [clearItinerary]);

  const handlePredefinedTour = async (tour: PredefinedTour) => {
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

  const handleCategoryItinerary = () => {
    navigate('/categories');
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
  console.log('[ITINERARY] Banner image path: /images/banner-itinerary.jpg');

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Banner */}
      <div 
        className="relative bg-cover bg-center border-b"
        style={{
          backgroundImage: `url('/src/assets/images/banner-itinerary.jpg')`
        }}
      >
        {/* Yellow gradient overlay - 30% more transparent (from 35% to 14%) */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/35 to-yellow-500/14" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Plan Your Producer Tour</h1>
            <WeatherWidget />
          </div>
          <p className="text-lg text-gray-800 max-w-2xl">
            Discover local farms, wineries, and artisan producers across Eastern Ontario. 
            Choose from our curated tours or build your own custom itinerary.
          </p>
          
          {/* Group Size Toggle */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-800">Group size:</span>
            <button
              onClick={() => setIsLargeGroup(!isLargeGroup)}
              className="flex items-center gap-2 px-3 py-1 rounded-full border transition-colors"
              style={{
                backgroundColor: isLargeGroup ? 'hsl(var(--primary))' : 'transparent',
                color: isLargeGroup ? 'white' : '#374151',
                borderColor: isLargeGroup ? 'hsl(var(--primary))' : '#9CA3AF'
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

      <div className="container mx-auto px-4 py-8">
        {/* Custom Itinerary Options */}
        <div className="mb-12">
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
              onClick={() => handleCategoryItinerary()}
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

        {/* Quick Start Tours */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6">Quick Start Tours</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {predefinedTours.map((tour) => {
              const metrics = calculateMetrics(tour.estimatedDistance, tour.producerIds.length, isLargeGroup);
              
              return (
                <Card
                  key={tour.id}
                  className="hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <CardHeader className="flex-none">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{tour.emoji}</span>
                          <span className="text-lg">{tour.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1 min-h-[2.5rem]">
                          {tour.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Top Section - Metrics (fixed height) */}
                    <div className="flex-none mb-4">
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
                    </div>
                    
                    {/* Middle Section - Spacer to push thumbnails down */}
                    <div className="flex-1" />
                    
                    {/* Bottom Section - Thumbnails, stops info, and button */}
                    <div className="flex-none space-y-3">
                      {/* Producer Thumbnails */}
                      <div className="space-y-2">
                        {tour.producerIds.slice(0, 3).map((producerId, index) => {
                          const producerData = producers.find(p => p.id === producerId);
                          
                          return (
                            <div key={producerId} className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                              <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                <ProducerImage
                                  producerSlug={`${producerId}-1`}
                                  alt={producerData?.name || producerId}
                                  size="thumb"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs text-muted-foreground truncate">
                                {producerData?.name || producerId}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Stops */}
                      <div className="text-xs text-muted-foreground">
                        {tour.producerIds.length} stops • {tour.familyFriendly ? 'Family friendly' : 'Adults preferred'}
                      </div>
                      
                      {/* CTA */}
                      <div className="pt-8">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePredefinedTour(tour);
                          }}
                          size="default" 
                          className="w-full text-sm"
                        >
                          Start My Itinerary
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};