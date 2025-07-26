import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface CollapsiblePanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  isExpanded,
  onToggle,
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white border-t border-gray-200 shadow-lg transition-all duration-300",
      className
    )}>
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>
      
      {/* Collapsible content */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[30vh] overflow-y-auto" : "max-h-0"
      )}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
};