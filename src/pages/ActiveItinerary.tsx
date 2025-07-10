import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ChevronLeft, ChevronRight, CheckCircle, Circle, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItineraryMap } from '@/components/ItineraryMap';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { useItinerary } from '@/hooks/useItinerary';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/utils/distance';
import { cn } from '@/lib/utils';

export const ActiveItinerary: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProducers } = useItinerary();
  const { latitude, longitude, error: locationError, loading: locationLoading } = useLocation();
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [visitedStops, setVisitedStops] = useState<Set<string>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);
  
  const userLocation = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : null;

  // Watch user location for live updates
  useEffect(() => {
    if (isNavigating && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        () => {
          // Location updates are handled by the LocationContext
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
      
      return () => {
        if (id) navigator.geolocation.clearWatch(id);
      };
    }
  }, [isNavigating]);

  const handleMarkVisited = (producerId: string) => {
    setVisitedStops(prev => {
      const newSet = new Set(prev);
      if (newSet.has(producerId)) {
        newSet.delete(producerId);
      } else {
        newSet.add(producerId);
        // Auto-advance to next stop when current is marked as visited
        if (producerId === currentProducer?.id && currentStopIndex < selectedProducers.length - 1) {
          setCurrentStopIndex(currentStopIndex + 1);
        }
      }
      return newSet;
    });
  };

  const handleProducerClick = (_producer: any, index: number) => {
    setCurrentStopIndex(index);
  };

  const handleNavigateToStop = () => {
    setIsNavigating(true);
    // Map will auto-center on current stop
  };

  const handleNextStop = () => {
    if (currentStopIndex < selectedProducers.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
    }
  };

  const handlePreviousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
    }
  };

  if (selectedProducers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Active Itinerary</h2>
          <p className="text-gray-600 mb-6">
            Create an itinerary first by selecting producers from the map or categories.
          </p>
          <Button onClick={() => navigate('/itinerary')}>
            Go to Itinerary
          </Button>
        </div>
      </div>
    );
  }

  const currentProducer = selectedProducers[currentStopIndex];
  const nextProducer = currentStopIndex < selectedProducers.length - 1 
    ? selectedProducers[currentStopIndex + 1]
    : null;

  // Calculate distance to current stop
  const distanceToCurrentStop = userLocation && currentProducer
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        currentProducer.location.lat,
        currentProducer.location.lng
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/itinerary')}
              className="gap-1"
            >
              <Home className="h-4 w-4" />
              Exit Navigation
            </Button>
            <div className="text-sm font-medium">
              Stop {currentStopIndex + 1} of {selectedProducers.length}
            </div>
            <div className="text-sm text-gray-600">
              {visitedStops.size} visited
            </div>
          </div>
        </div>
      </div>

      {/* Map Section - Full Height */}
      <div className="flex-1 relative">
        <ItineraryMap
          producers={selectedProducers.map(p => ({
            ...p,
            coordinates: p.location
          }))}
          currentProducerIndex={currentStopIndex}
          onProducerClick={handleProducerClick}
          onMarkVisited={handleMarkVisited}
          visitedProducers={visitedStops}
          userLocation={userLocation || undefined}
        />

        {/* Current Stop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          {/* Progress Indicator */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs text-gray-600">
                {Math.round((visitedStops.size / selectedProducers.length) * 100)}% Complete
              </span>
            </div>
            <div className="flex gap-1">
              {selectedProducers.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-colors",
                    index === currentStopIndex
                      ? "bg-orange-600"
                      : visitedStops.has(selectedProducers[index].id)
                      ? "bg-green-600"
                      : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Current Stop Details */}
          <div className="p-4">
            <div className="flex gap-4">
              <ProducerImage
                producerSlug={`${currentProducer.id}-1`}
                alt={currentProducer.name}
                size="thumb"
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{currentProducer.name}</h3>
                <p className="text-sm text-gray-600 truncate">{currentProducer.location.address}</p>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  {distanceToCurrentStop !== null && (
                    <span className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {distanceToCurrentStop.toFixed(1)} km away
                    </span>
                  )}
                  <span className={cn(
                    "flex items-center gap-1",
                    visitedStops.has(currentProducer.id) ? "text-green-600" : "text-gray-600"
                  )}>
                    {visitedStops.has(currentProducer.id) ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                    {visitedStops.has(currentProducer.id) ? "Visited" : "Not visited"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousStop}
                disabled={currentStopIndex === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button
                variant={visitedStops.has(currentProducer.id) ? "outline" : "default"}
                size="sm"
                onClick={() => handleMarkVisited(currentProducer.id)}
                className="gap-1"
              >
                {visitedStops.has(currentProducer.id) ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Visited
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" />
                    Mark Visited
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStop}
                disabled={currentStopIndex === selectedProducers.length - 1}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigate Button */}
            <Button
              className="w-full mt-3 gap-2"
              size="lg"
              onClick={handleNavigateToStop}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5" />
                  Navigate to {currentProducer.name}
                </>
              )}
            </Button>

            {/* Next Stop Preview */}
            {nextProducer && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Next stop:</p>
                <p className="text-sm font-medium truncate">{nextProducer.name}</p>
              </div>
            )}

            {/* Location Error */}
            {locationError && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-800">
                  Location access needed for navigation. Please enable location services.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};