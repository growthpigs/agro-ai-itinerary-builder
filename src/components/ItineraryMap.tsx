import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Producer } from '@/types';

// Import leaflet-routing-machine - now bundled with map-vendor
import 'leaflet-routing-machine';

// Load CSS from CDN to avoid bundling issues
let cssLoaded = false;
const loadRoutingCSS = () => {
  if (!cssLoaded && typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css';
    document.head.appendChild(link);
    cssLoaded = true;
  }
};

// Navigation control types
export interface NavigationInstruction {
  text: string;
  distance: number;
  time: number;
  type: string;
  direction?: string;
}

export interface NavigationInfo {
  totalDistance: number;
  totalTime: number;
  instructions: NavigationInstruction[];
}

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

// NavigationControl component that uses useMap hook
function NavigationControl({ 
  from, 
  to, 
  isActive, 
  onRouteCalculated, 
  onError 
}: {
  from: { lat: number; lng: number };
  to: Producer;
  isActive: boolean;
  onRouteCalculated: (routeInfo: NavigationInfo) => void;
  onError: (error: string) => void;
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive || !from || !to) return;

    console.log('🗺️ NavigationControl: Starting route calculation...', { from, to: to.location });

    const setupRouting = () => {
      // Load CSS for routing machine
      loadRoutingCSS();
      
      // Set timeout for route calculation
      const timeoutId = setTimeout(() => {
        console.error('⏰ NavigationControl: Route calculation timeout after 15 seconds');
        onError('Route calculation is taking too long. Please try again or use Google Maps.');
      }, 15000);

      // Create routing control
      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lng),
          L.latLng(to.location.lat, to.location.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: '#ea580c', weight: 6, opacity: 0.8 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        } as any,
        router: (L as any).Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          timeout: 10000 // 10 second timeout
        }),
        showAlternatives: false,
        fitSelectedRoutes: true,
        // Hide default control UI (property not in typings)
        show: false,
        // Remove default markers
        createMarker: () => null
      } as any).addTo(map);

      // Listen for routing events
      control.on('routesfound', (e: unknown) => {
        clearTimeout(timeoutId);
        const routes = (e as { routes: unknown[] }).routes as Array<unknown>;
        if (routes && routes.length > 0) {
          const route = routes[0] as unknown;
          
          // Parse instructions
          const routeWithInstructions = route as { instructions?: Array<{ text: string; distance: number; time: number; type: string; direction?: string }>; summary: { totalDistance: number; totalTime: number } };
          const instructions = (routeWithInstructions.instructions || []).map((instruction) => ({
            text: instruction.text,
            distance: instruction.distance,
            time: instruction.time,
            type: instruction.type,
            direction: instruction.direction
          }));
          
          const routeInfo = {
            totalDistance: routeWithInstructions.summary.totalDistance,
            totalTime: routeWithInstructions.summary.totalTime,
            instructions
          };
          console.log('🚦 NavigationControl: Route calculated successfully!', routeInfo);
          onRouteCalculated(routeInfo);
        } else {
          console.error('❌ NavigationControl: No routes found in response');
          onError('No route found between these locations.');
        }
      });

      control.on('routingerror', (e: unknown) => {
        clearTimeout(timeoutId);
        console.error('❌ NavigationControl: Routing service error:', e);
        onError('Unable to find route. The routing service may be unavailable. Please try Google Maps instead.');
      });

      routingControlRef.current = control;

      return () => {
        clearTimeout(timeoutId);
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    };

    try {
      setupRouting();
    } catch (error) {
      console.error('❌ NavigationControl: Failed to setup routing:', error);
      onError('Failed to load routing functionality. Please try Google Maps instead.');
    }
  }, [isActive, from, to, map, onRouteCalculated, onError]);

  return null; // This component doesn't render anything
}

interface ItineraryMapProps {
  producers: Producer[];
  currentProducerIndex?: number;
  className?: string;
  height?: string;
  focusOnCurrent?: boolean;
  isNavigating?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  // Navigation props
  navigationFrom?: { lat: number; lng: number };
  navigationTo?: Producer;
  onRouteCalculated?: (routeInfo: NavigationInfo) => void;
  onNavigationError?: (error: string) => void;
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

// Component to handle routing
function RoutingControl({ 
  from, 
  to,
  isActive
}: { 
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  isActive: boolean;
}) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    const setupRouting = () => {
      // Load CSS for routing machine
      loadRoutingCSS();

      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lng),
          L.latLng(to.lat, to.lng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        lineOptions: {
          styles: [{ color: '#3b82f6', weight: 4, opacity: 0.7 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        } as any,
        router: (L as any).Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving'
        }),
        showAlternatives: false,
        fitSelectedRoutes: false,
        show: false,
        createMarker: () => null
      } as any);

      control.addTo(map);
      routingControlRef.current = control;

      return () => {
        if (routingControlRef.current) {
          map.removeControl(routingControlRef.current);
          routingControlRef.current = null;
        }
      };
    };

    try {
      setupRouting();
    } catch (error) {
      console.error('❌ RoutingControl: Failed to setup routing:', error);
    }
  }, [map, from, to, isActive]);

  return null;
}

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  producers,
  currentProducerIndex = 0,
  className = '',
  height = '400px',
  focusOnCurrent = false,
  isNavigating = false,
  userLocation,
  navigationFrom,
  navigationTo,
  onRouteCalculated,
  onNavigationError
}) => {
  if (producers.length === 0) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No producers to display</p>
      </div>
    );
  }

  // Calculate center point
  let center: [number, number];
  
  if (focusOnCurrent && currentProducerIndex < producers.length) {
    const currentProducer = producers[currentProducerIndex];
    center = [currentProducer.location.lat, currentProducer.location.lng];
  } else if (userLocation) {
    center = [userLocation.lat, userLocation.lng];
  } else {
    // Calculate center of all producers
    const avgLat = producers.reduce((sum, p) => sum + p.location.lat, 0) / producers.length;
    const avgLng = producers.reduce((sum, p) => sum + p.location.lng, 0) / producers.length;
    center = [avgLat, avgLng];
  }

  const zoom = focusOnCurrent ? 13 : 10;

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={DefaultIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Producer markers */}
        {producers.map((producer, index) => (
          <Marker
            key={producer.id}
            position={[producer.location.lat, producer.location.lng]}
            icon={createNumberedIcon(index + 1, index === currentProducerIndex)}
          >
            <Popup>
              <div className="text-center">
                <strong>{producer.name}</strong>
                <p className="text-sm text-gray-600">{producer.location.address}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {producer.categories.slice(0, 2).map(category => (
                    <span 
                      key={category}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route lines between producers (overview mode) */}
        {!isNavigating && producers.length > 1 && (
          <>
            {producers.slice(0, -1).map((producer, index) => {
              const nextProducer = producers[index + 1];
              return (
                <RoutingControl
                  key={`${producer.id}-${nextProducer.id}`}
                  from={producer.location}
                  to={nextProducer.location}
                  isActive={true}
                />
              );
            })}
          </>
        )}

        {/* Navigation control (turn-by-turn mode) */}
        {isNavigating && navigationFrom && navigationTo && onRouteCalculated && onNavigationError && (
          <NavigationControl
            from={navigationFrom}
            to={navigationTo}
            isActive={true}
            onRouteCalculated={onRouteCalculated}
            onError={onNavigationError}
          />
        )}
      </MapContainer>
    </div>
  );
};