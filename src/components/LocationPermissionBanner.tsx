import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';

export const LocationPermissionBanner: React.FC = () => {
  const { permissionState, error, loading } = useLocation();
  const [dismissed, setDismissed] = React.useState(false);

  // Don't show if loading, permission granted, or dismissed
  if (loading || permissionState === 'granted' || dismissed) {
    return null;
  }

  // Only show if there's an error or permission is denied/prompt
  if (!error && permissionState !== 'denied' && permissionState !== 'prompt') {
    return null;
  }

  const handleEnableLocation = () => {
    // Trigger a new location request
    window.location.reload();
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Location access needed for best experience
            </p>
            <p className="text-xs text-yellow-700 mt-0.5">
              We'll use your location to find nearby producers and optimize your route
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEnableLocation}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          >
            Enable Location
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};