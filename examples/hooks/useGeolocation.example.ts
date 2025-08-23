import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

/**
 * Custom hook for managing geolocation in the AGRO AI Itinerary Builder
 * Handles permissions, errors, and provides location updates
 * @param options - Geolocation API options
 * @returns Current location state and control functions
 * @example
 * const { location, error, loading, requestLocation } = useGeolocation({
 *   enableHighAccuracy: true,
 *   timeout: 10000
 * });
 */
export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  // Success callback
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
      loading: false
    });
  }, []);

  // Error callback with user-friendly messages
  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage: string;
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location services.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable. Please try again.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out. Please try again.';
        break;
      default:
        errorMessage = 'An unknown error occurred while getting location.';
    }

    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: errorMessage,
      loading: false
    });
  }, []);

  // Request current location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const geoOptions: PositionOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 0
    };

    if (options.watchPosition) {
      // Clear existing watch if any
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
      setWatchId(id);
    } else {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geoOptions
      );
    }
  }, [options, watchId, handleSuccess, handleError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  // Check if location services are available
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return 'unavailable';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'unavailable';
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Auto-request location on mount if specified
  useEffect(() => {
    if (options.watchPosition) {
      requestLocation();
    }
  }, [options.watchPosition, requestLocation]); // Include dependencies

  return {
    location: state.latitude && state.longitude ? {
      lat: state.latitude,
      lng: state.longitude,
      accuracy: state.accuracy
    } : null,
    error: state.error,
    loading: state.loading,
    requestLocation,
    stopWatching,
    checkPermission
  };
};

// Example usage in a component:
/*
import React from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

export const LocationButton: React.FC = () => {
  const { location, error, loading, requestLocation } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000
  });

  return (
    <div>
      <button 
        onClick={requestLocation} 
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Getting location...' : 'Get My Location'}
      </button>
      
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
      
      {location && (
        <p className="text-green-500 mt-2">
          Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
};
*/