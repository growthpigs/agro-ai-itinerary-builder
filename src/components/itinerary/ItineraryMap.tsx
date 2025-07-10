import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Producer } from '@/types';
import { getPrimaryCategoryIcon } from '@/utils/categoryIcons';
import { useLocation } from '@/contexts/LocationContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ItineraryMapProps {
  producers: Producer[];
  className?: string;
}

// Component to fit map bounds
const FitBounds: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, bounds]);
  return null;
};

export const ItineraryMap: React.FC<ItineraryMapProps> = ({ producers, className = '' }) => {
  const { latitude, longitude } = useLocation();
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  
  const userLocation = latitude && longitude 
    ? { lat: latitude, lng: longitude }
    : null;

  useEffect(() => {
    // Create route coordinates including user location if available
    const coords: [number, number][] = [];
    
    if (userLocation) {
      coords.push([userLocation.lat, userLocation.lng]);
    }
    
    producers.forEach(producer => {
      coords.push([producer.location.lat, producer.location.lng]);
    });
    
    // Add return to start if user location exists
    if (userLocation && coords.length > 1) {
      coords.push([userLocation.lat, userLocation.lng]);
    }
    
    setRouteCoordinates(coords);
  }, [producers, userLocation]);

  if (producers.length === 0) {
    return null;
  }

  // Calculate bounds for all markers
  const bounds = L.latLngBounds(
    routeCoordinates.length > 0 ? routeCoordinates : [[producers[0].location.lat, producers[0].location.lng]]
  );

  // Create custom numbered markers for each producer
  const createNumberedIcon = (number: number, isHighlighted: boolean = false) => {
    return L.divIcon({
      html: `<div class="${isHighlighted ? 'bg-orange-600' : 'bg-primary-600'} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">${number}</div>`,
      className: 'custom-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const userIcon = L.divIcon({
    html: '<div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Default center if no user location
  const defaultCenter: [number, number] = producers.length > 0 
    ? [producers[0].location.lat, producers[0].location.lng]
    : [45.4215, -75.6972]; // Ottawa

  return (
    <div className={`${className} rounded-lg overflow-hidden shadow-lg border border-gray-200`}>
      <MapContainer
        center={defaultCenter}
        zoom={11}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all markers */}
        <FitBounds bounds={bounds} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Producer markers */}
        {producers.map((producer, index) => {
          const Icon = getPrimaryCategoryIcon(producer.categories);
          return (
            <Marker
              key={producer.id}
              position={[producer.location.lat, producer.location.lng]}
              icon={createNumberedIcon(index + 1)}
            >
              <Popup>
                <div className="max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-primary-600" />
                    <strong className="text-base">{producer.name}</strong>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{producer.location.address}</p>
                  <p className="text-xs text-gray-500">Stop #{index + 1}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Route polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#ea580c"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
};