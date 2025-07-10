import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Crosshair, Maximize2, Minimize2, Clock, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Producer } from '@/types';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProducer extends Producer {
  coordinates: { lat: number; lng: number };
}

interface ItineraryMapProps {
  producers: MapProducer[];
  currentProducerIndex?: number;
  onProducerClick?: (producer: MapProducer, index: number) => void;
  onMarkVisited?: (producerId: string) => void;
  visitedProducers?: Set<string>;
  userLocation?: { lat: number; lng: number } | null;
}

// Custom hook for map controls
function MapControls({ producers, currentProducerIndex, userLocation }: {
  producers: MapProducer[];
  currentProducerIndex?: number;
  userLocation?: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  const fitAllProducers = () => {
    if (producers.length === 0) return;
    
    const bounds = L.latLngBounds(
      producers.map(p => [p.coordinates.lat, p.coordinates.lng])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  const centerOnUser = () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  };

  const centerOnCurrentStop = () => {
    if (currentProducerIndex !== undefined && producers[currentProducerIndex]) {
      const producer = producers[currentProducerIndex];
      map.setView([producer.coordinates.lat, producer.coordinates.lng], 16);
    }
  };

  useEffect(() => {
    // Initial fit to show all producers
    fitAllProducers();
  }, [producers]);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={fitAllProducers}
        className="bg-white shadow-md"
        title="Fit all stops"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      {userLocation && (
        <Button
          size="sm"
          variant="secondary"
          onClick={centerOnUser}
          className="bg-white shadow-md"
          title="Center on my location"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      )}
      {currentProducerIndex !== undefined && (
        <Button
          size="sm"
          variant="secondary"
          onClick={centerOnCurrentStop}
          className="bg-white shadow-md"
          title="Center on current stop"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Custom numbered marker
const createNumberedIcon = (number: number, isActive: boolean = false, isVisited: boolean = false) => {
  const markerHtml = `
    <div style="
      background-color: ${isVisited ? '#6b7280' : isActive ? '#ea580c' : '#3b82f6'};
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      ${number}
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'numbered-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

// User location marker
const userLocationIcon = L.divIcon({
  html: `
    <div style="
      background-color: #4ade80;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    ">
    </div>
  `,
  className: 'user-location-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  producers,
  currentProducerIndex = 0,
  onProducerClick,
  onMarkVisited,
  visitedProducers = new Set(),
  userLocation,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Calculate route waypoints
  const routeWaypoints = producers.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number]);

  // Calculate total distance
  const calculateTotalDistance = () => {
    let total = 0;
    for (let i = 0; i < producers.length - 1; i++) {
      const from = producers[i].coordinates;
      const to = producers[i + 1].coordinates;
      total += calculateDistance(from.lat, from.lng, to.lat, to.lng);
    }
    return total;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const totalDistance = calculateTotalDistance();
  const estimatedTime = Math.round(totalDistance / 50 * 60); // Assuming 50km/h average

  // Get map center
  const getMapCenter = (): [number, number] => {
    if (producers.length === 0) {
      return [45.4215, -75.6972]; // Ottawa as default
    }
    
    // Calculate the center of all producers
    const sumLat = producers.reduce((sum, p) => sum + p.coordinates.lat, 0);
    const sumLng = producers.reduce((sum, p) => sum + p.coordinates.lng, 0);
    return [sumLat / producers.length, sumLng / producers.length];
  };

  return (
    <div className={cn(
      "relative w-full transition-all duration-300",
      isFullscreen ? "fixed inset-0 z-50" : "h-[400px] md:h-[500px] rounded-lg overflow-hidden"
    )}>
      {/* Map Info Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Route className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{totalDistance.toFixed(1)} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="font-medium">~{estimatedTime} min</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{producers.length} stops</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="ml-auto"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Map Container */}
      <MapContainer
        center={getMapCenter()}
        zoom={10}
        className="h-full w-full"
        ref={mapRef}
        style={{ marginTop: '52px', height: 'calc(100% - 52px)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Controls */}
        <MapControls
          producers={producers}
          currentProducerIndex={currentProducerIndex}
          userLocation={userLocation}
        />

        {/* Route polyline */}
        {routeWaypoints.length > 1 && (
          <Polyline
            positions={routeWaypoints}
            color="#3b82f6"
            weight={4}
            opacity={0.8}
          />
        )}

        {/* Producer markers */}
        {producers.map((producer, index) => {
          const isActive = index === currentProducerIndex;
          const isVisited = visitedProducers.has(producer.id);
          
          return (
            <Marker
              key={producer.id}
              position={[producer.coordinates.lat, producer.coordinates.lng]}
              icon={createNumberedIcon(index + 1, isActive, isVisited)}
              eventHandlers={{
                click: () => onProducerClick?.(producer, index),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-base mb-1">{producer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{producer.categories.join(', ')}</p>
                  <div className="space-y-1">
                    <Button
                      size="sm"
                      variant={isVisited ? "outline" : "default"}
                      className="w-full"
                      onClick={() => onMarkVisited?.(producer.id)}
                    >
                      {isVisited ? "Visited ✓" : "Mark as Visited"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => onProducerClick?.(producer, index)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>Your current location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Navigation Progress Bar */}
      {producers.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-t p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Stop {currentProducerIndex + 1} of {producers.length}
            </span>
            <span className="text-sm text-gray-600">
              {visitedProducers.size} visited
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentProducerIndex + 1) / producers.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};