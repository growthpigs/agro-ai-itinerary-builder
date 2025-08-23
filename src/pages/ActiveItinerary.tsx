import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, ChevronLeft, ChevronRight, Map, List, Check, ExternalLink } from 'lucide-react';
import { calculateDistance } from '@/utils/distance';
import { useItinerary } from '@/hooks/useItinerary';
import { useLocation } from '@/contexts/LocationContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { ProgressStats } from '@/components/ui/ProgressCard';
import { ItineraryMap } from '@/components/ItineraryMap';

export const ActiveItinerary: React.FC = () => {
  const { selectedProducers } = useItinerary();
  const { latitude, longitude } = useLocation();
  const navigate = useNavigate();
  const { trackItineraryStarted, trackItineraryCompleted, trackProducerVisited, trackNavigationOpened } = useAnalytics();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [visitedStops, setVisitedStops] = useState<Set<number>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);
  const [itineraryStartTime] = useState<number>(Date.now());
  
  const userLocation = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : null;

  // Track itinerary started on component mount
  useEffect(() => {
    if (selectedProducers.length > 0) {
      trackItineraryStarted(selectedProducers);
    }
  }, [selectedProducers, trackItineraryStarted]);

  // Track completion when all stops are visited
  useEffect(() => {
    if (visitedStops.size === selectedProducers.length && selectedProducers.length > 0) {
      const totalTime = Date.now() - itineraryStartTime;
      trackItineraryCompleted(selectedProducers, totalTime);
    }
  }, [visitedStops.size, selectedProducers, itineraryStartTime, trackItineraryCompleted]);

  if (selectedProducers.length === 0) {
    navigate('/itinerary');
    return null;
  }

  const currentStop = selectedProducers[currentStopIndex];
  const totalStops = selectedProducers.length;

  const markAsVisited = () => {
    setVisitedStops(prev => new Set([...prev, currentStopIndex]));
    trackProducerVisited(currentStop);
  };

  const navigateToStop = () => {
    // Always open Google Maps with specific coordinates for accurate navigation
    openInGoogleMaps();
  };

  const openInGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(currentStop.location.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&destination_place_id=&center=${currentStop.location.lat},${currentStop.location.lng}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
    trackNavigationOpened(currentStop);
  };

  const goToNextStop = () => {
    if (currentStopIndex < totalStops - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
    }
  };

  const goToPreviousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
    }
  };

  const distance = userLocation && currentStopIndex === 0
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        currentStop.location.lat,
        currentStop.location.lng
      )
    : currentStopIndex > 0
    ? calculateDistance(
        selectedProducers[currentStopIndex - 1].location.lat,
        selectedProducers[currentStopIndex - 1].location.lng,
        currentStop.location.lat,
        currentStop.location.lng
      )
    : 0;

  // Calculate total route distance
  const calculateTotalDistance = () => {
    let total = 0;
    for (let i = 0; i < selectedProducers.length - 1; i++) {
      const from = selectedProducers[i].location;
      const to = selectedProducers[i + 1].location;
      total += calculateDistance(from.lat, from.lng, to.lat, to.lng);
    }
    return total;
  };

  const totalDistance = calculateTotalDistance();
  const estimatedTime = Math.round(totalDistance / 50 * 60); // Assuming 50km/h average

  // Check if all stops are visited
  const allStopsVisited = visitedStops.size === selectedProducers.length;

  // Content for progress and current stop
  const ProgressSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {allStopsVisited ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Journey Complete!</h3>
          <p className="text-sm text-gray-600 mb-4">
            You've visited all {selectedProducers.length} stops on your itinerary
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm max-w-xs mx-auto">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600">Total Distance</p>
              <p className="font-semibold">{totalDistance.toFixed(1)} km</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-600">Time Taken</p>
              <p className="font-semibold">~{estimatedTime} min</p>
            </div>
          </div>
          <Link to="/itinerary" className="block mt-4">
            <Button className="w-full">
              Plan New Journey
            </Button>
          </Link>
        </div>
      ) : (
        <ProgressStats
          currentStop={currentStopIndex + 1}
          totalStops={totalStops}
          visitedStops={visitedStops.size}
          distance={totalDistance}
          estimatedTime={estimatedTime}
        />
      )}
    </div>
  );

  const CurrentStopDetails = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-4">
        <ProducerImage 
          producerSlug={`${currentStop.id}-1`}
          alt={currentStop.name}
          size="thumb"
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStop.name}
              </h2>
              <p className="text-gray-600 mb-3">
                {currentStop.location.address}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {distance > 1000 ? `${(distance/1000).toFixed(0)}k km away` : `${distance.toFixed(1)}km away`}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  ~45 min visit
                </span>
              </div>
            </div>
            {visitedStops.has(currentStopIndex) && (
              <div className="flex items-center gap-1 text-green-600">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Visited</span>
              </div>
            )}
          </div>
          <p className="text-gray-700 mt-4">
            {currentStop.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentStop.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ActionButtons = () => (
    <div className="space-y-3 mb-6">
      <Button
        onClick={navigateToStop}
        className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-lg py-6"
      >
        <Navigation className="h-5 w-5" />
        Get Directions to {currentStop.name}
      </Button>
      {distance <= 1000 && (
        <Button
          onClick={openInGoogleMaps}
          className="w-full gap-2 bg-[#4285F4] hover:bg-[#357ae8] text-white"
        >
          <ExternalLink className="h-5 w-5" />
          Open in Google Maps
        </Button>
      )}
      {!visitedStops.has(currentStopIndex) && (
        <Button
          onClick={markAsVisited}
          variant="outline"
          className="w-full gap-2"
        >
          <Check className="h-5 w-5" />
          Mark as Visited
        </Button>
      )}
      <Link to={`/producer/${currentStop.id}`} className="block">
        <Button variant="outline" className="w-full">
          View Full Details
        </Button>
      </Link>
    </div>
  );

  const NavigationControls = () => (
    <div className="flex items-center justify-between mb-6">
      <Button
        onClick={goToPreviousStop}
        disabled={currentStopIndex === 0}
        variant="outline"
      >
        Previous Stop
      </Button>
      <span className="text-sm text-gray-600">
        {currentStopIndex + 1} / {totalStops}
      </span>
      <Button
        onClick={goToNextStop}
        disabled={currentStopIndex === totalStops - 1}
        variant="outline"
      >
        Next Stop
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/itinerary">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  {isNavigating ? 'Exit' : 'Back'}
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isNavigating ? 'Navigating' : `Stop ${currentStopIndex + 1} of ${totalStops}`}
                </h1>
                <p className="text-sm text-gray-600">
                  {visitedStops.size} visited • v2.2.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isNavigating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNavigating(false)}
                >
                  End Navigation
                </Button>
              )}
              {/* Only show toggle on desktop when not navigating */}
              {!isNavigating && (
                <div className="hidden md:flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-1"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="gap-1"
              >
                <Map className="h-4 w-4" />
                Map
              </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile: Full-screen map with collapsible panel */}
        <div className="md:hidden">
          <div className="fixed inset-0 top-[64px] bottom-0">
            {/* Map - Full screen */}
            <ItineraryMap
              producers={selectedProducers}
              currentProducerIndex={currentStopIndex}
              className="h-full"
              height="100%"
              focusOnCurrent={isNavigating}
            />

            {/* Navigation overlay when in navigation mode */}
            {isNavigating && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-white rounded-lg shadow-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Navigating to:</span>
                    </div>
                    <span className="text-sm text-gray-600">{distance > 1000 ? `${(distance/1000).toFixed(0)}k km` : `${distance.toFixed(1)}km`}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{currentStop.name}</h3>
                  <p className="text-sm text-gray-600">{currentStop.location.address}</p>
                </div>
              </div>
            )}

            {/* Fixed bottom navigation bar - much thinner */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
              <div className="px-3 py-2">
                {/* Minimal navigation info */}
                {!allStopsVisited ? (
                  <div className="flex items-center justify-between gap-3">
                  {/* Left: Previous button */}
                  <Button
                    onClick={goToPreviousStop}
                    disabled={currentStopIndex === 0}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  {/* Center: Current stop info */}
                  <div className="flex-1 text-center">
                    <h3 className="font-semibold text-sm truncate">{currentStop.name}</h3>
                    <p className="text-xs text-gray-600">
                      Stop {currentStopIndex + 1} of {totalStops} • {distance > 1000 ? `${(distance/1000).toFixed(0)}k km` : `${distance.toFixed(1)}km`}
                    </p>
                  </div>

                  {/* Right: Navigate button and Next */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={navigateToStop}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 px-3"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={goToNextStop}
                      disabled={currentStopIndex === totalStops - 1}
                      variant="ghost"
                      size="sm"
                      className="p-2"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 py-1">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-sm">Journey Complete!</span>
                  <Link to="/itinerary">
                    <Button size="sm" variant="outline">
                      New Tour
                    </Button>
                  </Link>
                </div>
              )}
              </div>
            </div>
            </div>
          </div>


        {/* Desktop: Toggle between list and map view */}
        <div className="hidden md:block">
          {viewMode === 'list' ? (
            <>
              <ProgressSection />
              <CurrentStopDetails />
              <ActionButtons />
              <NavigationControls />
            </>
          ) : (
            <div className="space-y-4">
              <ItineraryMap
                producers={selectedProducers}
                currentProducerIndex={currentStopIndex}
                height="600px"
                className="shadow-sm border border-gray-200"
                focusOnCurrent={isNavigating}
              />
              
              {/* Compact info in map view */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <ProducerImage 
                    producerSlug={`${currentStop.id}-1`}
                    alt={currentStop.name}
                    size="thumb"
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{currentStop.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{currentStop.location.address}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {distance > 1000 ? `${(distance/1000).toFixed(0)}k km away` : `${distance.toFixed(1)}km away`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~45 min visit
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={navigateToStop}
                    className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Navigation className="h-5 w-5" />
                    Get Directions
                  </Button>
                  {distance <= 1000 && (
                    <Button
                      onClick={openInGoogleMaps}
                      className="w-full gap-2 bg-[#4285F4] hover:bg-[#357ae8] text-white"
                    >
                      <ExternalLink className="h-5 w-5" />
                      Open in Google Maps
                    </Button>
                  )}
                  {!visitedStops.has(currentStopIndex) && (
                    <Button
                      onClick={markAsVisited}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Check className="h-5 w-5" />
                      Mark as Visited
                    </Button>
                  )}
                </div>
              </div>

              <NavigationControls />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};