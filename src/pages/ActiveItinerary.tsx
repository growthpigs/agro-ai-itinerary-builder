import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, ChevronLeft, Map, List, Check } from 'lucide-react';
import { calculateDistance } from '@/utils/distance';
import { useItinerary } from '@/hooks/useItinerary';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { ProducerImage } from '@/components/ui/ProducerImage';

export const ActiveItinerary: React.FC = () => {
  const { selectedProducers } = useItinerary();
  const { latitude, longitude } = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [visitedStops, setVisitedStops] = useState<Set<number>>(new Set());
  
  const userLocation = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : null;

  if (selectedProducers.length === 0) {
    navigate('/itinerary');
    return null;
  }

  const currentStop = selectedProducers[currentStopIndex];
  const totalStops = selectedProducers.length;

  const markAsVisited = () => {
    setVisitedStops(prev => new Set([...prev, currentStopIndex]));
  };

  const navigateToStop = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentStop.location.lat},${currentStop.location.lng}`;
    window.open(googleMapsUrl, '_blank');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/itinerary">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Stop {currentStopIndex + 1} of {totalStops}
                </h1>
                <p className="text-sm text-gray-600">
                  {visitedStops.size} visited
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'list' ? (
          <>
            {/* Current Stop Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start gap-4">
                <ProducerImage 
                  producerSlug={`${currentStop.id}-1`}
                  alt={currentStop.name}
                  size="medium"
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
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
                          {distance}km away
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

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={navigateToStop}
                className="w-full gap-2 bg-orange-600 hover:bg-orange-700 text-lg py-6"
              >
                <Navigation className="h-5 w-5" />
                Navigate to {currentStop.name}
              </Button>
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

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
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

            {/* Upcoming Stops */}
            {currentStopIndex < totalStops - 1 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-3">Upcoming Stops</h3>
                <div className="space-y-2">
                  {selectedProducers.slice(currentStopIndex + 1).map((producer, idx) => (
                    <div
                      key={producer.id}
                      className="bg-gray-50 rounded-lg p-3 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {currentStopIndex + idx + 2}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{producer.name}</p>
                        <p className="text-sm text-gray-600">{producer.location.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Map View */
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[50vh] relative">
                {/* Try OpenStreetMap embed as it doesn't require API key */}
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentStop.location.lng - 0.01},${currentStop.location.lat - 0.01},${currentStop.location.lng + 0.01},${currentStop.location.lat + 0.01}&marker=${currentStop.location.lat},${currentStop.location.lng}&layer=mapnik`}
                  style={{ border: 0 }}
                />
                <div className="absolute bottom-2 right-2 bg-white rounded-lg shadow-md p-2">
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${currentStop.location.lat}&mlon=${currentStop.location.lng}#map=15/${currentStop.location.lat}/${currentStop.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Larger Map
                  </a>
                </div>
              </div>
            </div>
            
            {/* Current Stop Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <ProducerImage 
                  producerSlug={`${currentStop.id}-1`}
                  alt={currentStop.name}
                  size="medium"
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{currentStop.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{currentStop.location.address}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {distance}km away
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

            {/* Navigation Controls in Map View */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <Button
                onClick={goToPreviousStop}
                disabled={currentStopIndex === 0}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-600">
                Stop {currentStopIndex + 1} of {totalStops}
              </span>
              <Button
                onClick={goToNextStop}
                disabled={currentStopIndex === totalStops - 1}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};