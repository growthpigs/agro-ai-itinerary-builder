import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div className={cn(
      "bg-gray-50 rounded-lg p-3 flex items-center gap-3",
      className
    )}>
      <div className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="font-semibold text-sm truncate">{value}</p>
      </div>
    </div>
  );
};

interface ProgressStatsProps {
  currentStop: number;
  totalStops: number;
  visitedStops: number;
  distance: number;
  estimatedTime: number;
  className?: string;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  currentStop,
  totalStops,
  visitedStops,
  distance,
  estimatedTime,
  className,
}) => {
  const completionPercentage = Math.round((visitedStops / totalStops) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Trip Progress</h3>
        <span className="text-sm font-semibold text-orange-600">
          {completionPercentage}% Complete
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<span className="text-sm font-bold">{currentStop}</span>}
          label="Current Stop"
          value={`of ${totalStops}`}
        />
        <StatCard
          icon={<span className="text-sm font-bold">✓</span>}
          label="Visited"
          value={`${visitedStops} stops`}
        />
        <StatCard
          icon={<span className="text-sm font-bold">🚗</span>}
          label="Distance"
          value={`${distance.toFixed(1)} km`}
        />
        <StatCard
          icon={<span className="text-sm font-bold">⏱</span>}
          label="Est. Time"
          value={`${estimatedTime} min`}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Journey Progress</span>
          <span className="text-xs text-gray-600">{visitedStops}/{totalStops} stops</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};