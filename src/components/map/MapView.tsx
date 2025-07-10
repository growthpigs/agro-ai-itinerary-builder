import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Producer } from '@/types';
import { getProducerEmoji } from '@/utils/hours';
import { SafeLink } from '@/components/ui/SafeLink';

// Fix for default markers in React Leaflet
// @ts-expect-error - Leaflet typing issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  producers: Producer[];
  selectedProducers?: string[];
  onProducerClick?: (producer: Producer) => void;
  center?: [number, number];
  zoom?: number;
}

// Component to recenter map when center changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  
  return null;
}

export const MapView: React.FC<MapViewProps> = ({
  producers,
  selectedProducers = [],
  onProducerClick,
  center = [45.4215, -75.6972], // Default to Ottawa
  zoom = 10,
}) => {
  const [map, setMap] = useState<L.Map | null>(null);

  // Create emoji icon for a producer
  const createEmojiIcon = (producer: Producer, isSelected: boolean) => {
    const emoji = getProducerEmoji(producer.categories);
    const selectedIndex = selectedProducers.indexOf(producer.id);
    const showNumber = isSelected && selectedIndex !== -1;
    
    const html = `
      <div style="
        background: ${isSelected ? '#16a34a' : '#ffffff'};
        border: 2px solid ${isSelected ? '#16a34a' : '#e5e7eb'};
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        position: relative;
      ">
        ${emoji}
        ${showNumber ? `
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: #16a34a;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid white;
          ">${selectedIndex + 1}</div>
        ` : ''}
      </div>
    `;
    
    return L.divIcon({
      html,
      className: 'custom-emoji-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  // Fit bounds to show all producers
  useEffect(() => {
    if (map && producers.length > 0) {
      const bounds = L.latLngBounds(
        producers.map(p => [p.location.lat, p.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, producers]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        ref={setMap}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterMap center={center} />
        
        {producers.map((producer) => {
          const isSelected = selectedProducers.includes(producer.id);
          
          return (
            <Marker
              key={producer.id}
              position={[producer.location.lat, producer.location.lng]}
              icon={createEmojiIcon(producer, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onProducerClick) {
                    onProducerClick(producer);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-base mb-1">{producer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{producer.location.address}</p>
                  <p className="text-xs text-gray-500 mb-2">{producer.description}</p>
                  {producer.hours && (
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Hours:</strong> {producer.hours}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {producer.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  {producer.phone && (
                    <SafeLink
                      href={producer.phone}
                      type="phone"
                      className="text-sm text-blue-600 hover:underline block mb-1"
                      producerName={producer.name}
                      linkLabel="map-popup-phone"
                      disabledMessage="Invalid phone number"
                    >
                      {producer.phone}
                    </SafeLink>
                  )}
                  <SafeLink
                    href={`https://www.google.com/maps/dir/?api=1&destination=${producer.location.lat},${producer.location.lng}`}
                    type="external"
                    className="text-sm text-blue-600 hover:underline"
                    producerName={producer.name}
                    linkLabel="map-popup-directions"
                    disabledMessage="Location unavailable"
                  >
                    Get Directions →
                  </SafeLink>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};