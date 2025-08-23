import React, { useState } from 'react';
import { Navigation, MapPin, ArrowUp, ArrowUpRight, ArrowUpLeft, ArrowRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Producer } from '@/types';
import type { NavigationInfo } from './ItineraryMap';

interface NavigationViewProps {
  to: Producer;
  onClose: () => void;
  routeInfo: NavigationInfo | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const NavigationView: React.FC<NavigationViewProps> = ({ 
  to, 
  onClose, 
  routeInfo, 
  loading, 
  error, 
  onRetry 
}) => {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  console.log('🗺️ NavigationView rendered!', { to, routeInfo, loading, error });

  // Get icon based on instruction type
  const getInstructionIcon = (type: string, direction?: string) => {
    const iconClass = "h-4 w-4";
    
    if (type === 'WaypointReached') {
      return <MapPin className={iconClass} />;
    }
    
    const directionText = direction?.toLowerCase() || type?.toLowerCase() || '';
    
    if (directionText.includes('right') && !directionText.includes('slight')) {
      return <ArrowRight className={iconClass} />;
    }
    
    if (directionText.includes('left') && !directionText.includes('slight')) {
      return <ArrowLeft className={iconClass} />;
    }
    
    if (directionText.includes('slight right')) {
      return <ArrowUpRight className={iconClass} />;
    }
    
    if (directionText.includes('slight left')) {
      return <ArrowUpLeft className={iconClass} />;
    }
    
    if (type === 'Continue' || type === 'Straight' || directionText.includes('straight')) {
      return <ArrowUp className={iconClass} />;
    }
    
    return <Navigation className={iconClass} />;
  };

  // Format distance for display
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <div className="bg-white border-b border-gray-200 w-full">
      {/* Loading state */}
      {loading && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Calculating route...</p>
                <p className="text-blue-600 text-xs">This usually takes 5-10 seconds</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-xs text-blue-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border-b">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-700 text-sm font-medium">Navigation Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="text-xs"
              >
                Retry
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation instructions - normal component, not overlay */}
      {routeInfo && !loading && !error && (
        <div className="bg-white">
          {/* GPS Navigation Display */}
          <div className="bg-green-600 text-white">
            {/* Current Instruction */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Direction Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  {routeInfo.instructions[currentInstructionIndex] && 
                    <div className="text-white">
                      {getInstructionIcon(
                        routeInfo.instructions[currentInstructionIndex].type, 
                        routeInfo.instructions[currentInstructionIndex].direction
                      )}
                    </div>
                  }
                </div>
                
                {/* Instruction Text */}
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold mb-1">
                    {formatDistance(routeInfo.instructions[currentInstructionIndex]?.distance || 0)}
                  </div>
                  <div className="text-sm leading-tight">
                    {routeInfo.instructions[currentInstructionIndex]?.text || 'Starting route...'}
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Debug controls */}
                  {currentInstructionIndex < routeInfo.instructions.length - 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentInstructionIndex(currentInstructionIndex + 1)}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0 text-xs"
                      title="Next instruction (debug)"
                    >
                      →
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 px-3 py-1 text-xs font-medium"
                  >
                    End Navigation
                  </Button>
                </div>
              </div>
              
              {/* Next Instruction Preview */}
              {routeInfo.instructions[currentInstructionIndex + 1] && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <span>Then:</span>
                    <div className="scale-75">
                      {getInstructionIcon(
                        routeInfo.instructions[currentInstructionIndex + 1].type,
                        routeInfo.instructions[currentInstructionIndex + 1].direction
                      )}
                    </div>
                    <span className="truncate">{routeInfo.instructions[currentInstructionIndex + 1].text}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-white/20">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ 
                  width: `${((currentInstructionIndex + 1) / routeInfo.instructions.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Trip Info & Expandable Directions */}
          <div className="bg-gray-50">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-3 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{to.name}</span>
                <span className="text-gray-600">
                  {formatDistance(routeInfo.totalDistance)} • {formatTime(routeInfo.totalTime)}
                </span>
              </div>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {/* Expanded Full Directions */}
            {isExpanded && (
              <div className="max-h-48 overflow-y-auto bg-white border-t">
                <div className="p-4 space-y-2">
                  {routeInfo.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        index === currentInstructionIndex 
                          ? 'bg-green-50 border border-green-200' 
                          : index < currentInstructionIndex 
                          ? 'opacity-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentInstructionIndex 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getInstructionIcon(instruction.type, instruction.direction)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${
                          index === currentInstructionIndex ? 'font-medium' : ''
                        }`}>
                          {instruction.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistance(instruction.distance)}
                        </p>
                      </div>
                      {index === currentInstructionIndex && (
                        <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          Current
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Arrival */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Arrive at {to.name}</p>
                      <p className="text-xs text-gray-600">{to.location.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};