import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionState: PermissionState | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackCoords?: { latitude: number; longitude: number };
}

const DEFAULT_OPTIONS: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  fallbackCoords: { latitude: 45.4215, longitude: -75.6972 } // Ottawa
};

export { type GeolocationState, type UseGeolocationOptions };

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionState: null
  });

  useEffect(() => {
    let mounted = true;

    const checkPermissionAndGetLocation = async () => {
      try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          if (mounted) {
            setState({
              latitude: opts.fallbackCoords!.latitude,
              longitude: opts.fallbackCoords!.longitude,
              error: 'Geolocation is not supported by your browser',
              loading: false,
              permissionState: 'denied'
            });
          }
          return;
        }

        // Check permission state if available
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (mounted) {
              setState(prev => ({ ...prev, permissionState: permission.state }));
            }
            
            permission.addEventListener('change', () => {
              if (mounted) {
                setState(prev => ({ ...prev, permissionState: permission.state }));
              }
            });
          } catch (e) {
            console.log('Permissions API not fully supported');
          }
        }

        // Request location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (mounted) {
              setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                loading: false,
                permissionState: 'granted'
              });
            }
          },
          (error) => {
            if (mounted) {
              let errorMessage = 'Unable to retrieve your location';
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = 'Location permission denied';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = 'Location information is unavailable';
                  break;
                case error.TIMEOUT:
                  errorMessage = 'Location request timed out';
                  break;
              }
              
              setState({
                latitude: opts.fallbackCoords!.latitude,
                longitude: opts.fallbackCoords!.longitude,
                error: errorMessage,
                loading: false,
                permissionState: 'denied'
              });
            }
          },
          {
            enableHighAccuracy: opts.enableHighAccuracy,
            timeout: opts.timeout,
            maximumAge: opts.maximumAge
          }
        );
      } catch (error) {
        if (mounted) {
          setState({
            latitude: opts.fallbackCoords!.latitude,
            longitude: opts.fallbackCoords!.longitude,
            error: 'An unexpected error occurred',
            loading: false,
            permissionState: 'denied'
          });
        }
      }
    };

    checkPermissionAndGetLocation();

    return () => {
      mounted = false;
    };
  }, [opts.enableHighAccuracy, opts.timeout, opts.maximumAge, opts.fallbackCoords]);

  return state;
};