import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, Share2, Trash2, Route as RouteIcon, Grid3X3, Info } from 'lucide-react';
import { calculateDistance } from '@/utils/distance';
import { useItinerary } from '@/hooks/useItinerary';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { ProducerImage } from '@/components/ui/ProducerImage';

interface CategoryItineraryInfo {
  selectedCategories: string[];
  reasoning: string;
  categoryBreakdown: Record<string, number>;
}

export const Itinerary: React.FC = () => {
  const { selectedProducers, removeProducer, clearItinerary } = useItinerary();
  const { latitude, longitude } = useLocation();
  const navigate = useNavigate();
  const [categoryInfo, setCategoryInfo] = useState<CategoryItineraryInfo | null>(null);
  
  const userLocation = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : null;

  // Load category itinerary info if available
  useEffect(() => {
    const stored = sessionStorage.getItem('categoryItineraryInfo');
    if (stored) {
      try {
        const info = JSON.parse(stored);
        setCategoryInfo(info);
      } catch (err) {
        console.error('Failed to parse category itinerary info:', err);
      }
    }
  }, []);

  const handleShare = async () => {
    const producerIds = selectedProducers.map(p => p.id).join(',');
    const shareUrl = `${window.location.origin}/itinerary?stops=${producerIds}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Farm Tour Itinerary',
          text: 'Check out my Eastern Ontario farm tour!',
          url: shareUrl
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getGoogleMapsUrl = () => {
    if (selectedProducers.length === 0) return '';
    
    const baseUrl = 'https://www.google.com/maps/dir/';
    const waypoints = selectedProducers.map(p => 
      `${p.location.lat},${p.location.lng}`
    ).join('/');
    
    return `${baseUrl}${waypoints}`;
  };

  const calculateTotalDistance = () => {
    if (!userLocation || selectedProducers.length === 0) return 0;
    
    let total = 0;
    let currentLocation = userLocation;
    
    selectedProducers.forEach(producer => {
      total += calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        producer.location.lat,
        producer.location.lng
      );
      currentLocation = producer.location;
    });
    
    // Add return distance
    total += calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      userLocation.lat,
      userLocation.lng
    );
    
    return Math.round(total);
  };

  if (selectedProducers.length === 0) {
    return (
      <div className="bg-muted/30 py-12 px-4">
        <div className="text-center max-w-lg mx-auto">
          <div className="bg-background rounded-lg shadow-lg p-8">
            <RouteIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Planning Your Farm Tour</h2>
            <p className="text-muted-foreground mb-6">
              Create your perfect Eastern Ontario tour route by choosing producers or exploring by categories.
            </p>
            
            {/* Two buttons for different approaches */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button asChild size="lg" className="gap-2 flex-1">
                <Link to="/producers">
                  <MapPin className="h-5 w-5" />
                  Browse Producers
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 flex-1">
                <Link to="/categories">
                  <Grid3X3 className="h-5 w-5" />
                  Choose Categories
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Tip: Add 3-4 farms to build your ideal tour route
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalDistance = calculateTotalDistance();
  const estimatedTime = Math.round(selectedProducers.length * 45 + totalDistance * 1.5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Farm Tour Itinerary</h1>
              <p className="mt-1 text-sm text-gray-600">
                {selectedProducers.length} stops • {totalDistance}km • ~{estimatedTime} minutes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span className="hidden sm:inline">Navigate</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category-based Itinerary Info */}
        {categoryInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI-Generated Category Itinerary</h3>
                <p className="text-blue-800 text-sm mb-2">{categoryInfo.reasoning}</p>
                <div className="flex flex-wrap gap-2">
                  {categoryInfo.selectedCategories.map(cat => {
                    const categoryNames: Record<string, string> = {
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
                    return (
                      <span 
                        key={cat}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {categoryNames[cat] || cat}
                        {categoryInfo.categoryBreakdown[cat] && (
                          <span className="ml-1 text-blue-600">({categoryInfo.categoryBreakdown[cat]})</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stops List */}
        <div className="space-y-4 mb-8">
          {selectedProducers.map((producer, index) => {
            const distance = userLocation && index === 0
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  producer.location.lat,
                  producer.location.lng
                )
              : index > 0
              ? calculateDistance(
                  selectedProducers[index - 1].location.lat,
                  selectedProducers[index - 1].location.lng,
                  producer.location.lat,
                  producer.location.lng
                )
              : 0;

            return (
              <div
                key={producer.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0">
                    <ProducerImage 
                      producerSlug={`${producer.id}-1`}
                      alt={producer.name}
                      size="thumb"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {producer.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {producer.location.address}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {distance}km from previous
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            ~45 min visit
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProducer(producer.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <Link
                      to={`/producer/${producer.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mb-4">
          <button
            className="w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors text-lg"
            onClick={() => navigate('/active-itinerary')}
          >
            Start Itinerary
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/producers"
            className="flex-1 text-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add More Stops
          </Link>
          <button
            onClick={clearItinerary}
            className="flex-1 text-center px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Itinerary
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-primary-50 rounded-lg p-4">
          <h3 className="font-semibold text-primary-900 mb-2">Tips for your tour</h3>
          <ul className="text-sm text-primary-800 space-y-1 list-disc list-inside">
            <li>Call ahead to confirm hours and availability</li>
            <li>Bring cash - some farms may not accept cards</li>
            <li>Wear comfortable shoes and weather-appropriate clothing</li>
            <li>Bring reusable bags for your purchases</li>
          </ul>
        </div>
      </div>
    </div>
  );
};