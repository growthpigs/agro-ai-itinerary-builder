import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Producer } from '@/types';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ItineraryMapProps {
  producers: Producer[];
  currentProducerIndex?: number;
  className?: string;
  height?: string;
  focusOnCurrent?: boolean;
}

// Custom numbered marker
const createNumberedIcon = (number: number, isActive: boolean = false) => {
  const markerHtml = `
    <div style="
      background-color: ${isActive ? '#ea580c' : '#3b82f6'};
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

// Component to handle map initialization and bounds
function MapController({ 
  producers, 
  currentProducerIndex, 
  focusOnCurrent 
}: { 
  producers: Producer[];
  currentProducerIndex: number;
  focusOnCurrent: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (producers.length > 0) {
      if (focusOnCurrent && currentProducerIndex >= 0 && currentProducerIndex < producers.length) {
        // Focus on current producer when in navigation mode
        const currentProducer = producers[currentProducerIndex];
        map.setView([currentProducer.location.lat, currentProducer.location.lng], 15, {
          animate: true,
          duration: 1
        });
      } else {
        // Show all producers
        const bounds = L.latLngBounds(
          producers.map(p => [p.location.lat, p.location.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [producers, currentProducerIndex, focusOnCurrent, map]);

  return null;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  producers,
  currentProducerIndex = 0,
  className = '',
  height = '400px',
  focusOnCurrent = false,
}) => {
  // Get map center
  const getMapCenter = (): [number, number] => {
    if (producers.length === 0) {
      return [45.4215, -75.6972]; // Ottawa as default
    }
    
    // Calculate the center of all producers
    const sumLat = producers.reduce((sum, p) => sum + p.location.lat, 0);
    const sumLng = producers.reduce((sum, p) => sum + p.location.lng, 0);
    return [sumLat / producers.length, sumLng / producers.length];
  };

  // Create route polyline
  const routePositions = producers.map(p => [p.location.lat, p.location.lng] as [number, number]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={getMapCenter()}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          producers={producers} 
          currentProducerIndex={currentProducerIndex}
          focusOnCurrent={focusOnCurrent}
        />
        
        {/* Route polyline */}
        {routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color="#3b82f6"
            weight={4}
            opacity={0.6}
            dashArray="10, 10"
          />
        )}
        
        {/* Producer markers */}
        {producers.map((producer, index) => {
          const isActive = index === currentProducerIndex;
          
          return (
            <Marker
              key={producer.id}
              position={[producer.location.lat, producer.location.lng]}
              icon={createNumberedIcon(index + 1, isActive)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{producer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{producer.location.address}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => {
                        const encodedAddress = encodeURIComponent(producer.location.address);
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&destination_place_id=&center=${producer.location.lat},${producer.location.lng}&travelmode=driving`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="h-3 w-3" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};