import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Wheelchair } from 'lucide-react';
import { Producer } from '@/types/producer.types';
import { cn } from '@/lib/utils';

interface ProducerCardProps {
  producer: Producer;
  onSelect?: (producer: Producer) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * ProducerCard displays information about an agricultural producer
 * @param producer - The producer data to display
 * @param onSelect - Optional callback when card is clicked
 * @param isSelected - Whether this card is currently selected
 * @param className - Additional CSS classes
 * @example
 * <ProducerCard 
 *   producer={producerData} 
 *   onSelect={handleProducerSelect}
 *   isSelected={selectedId === producer.id}
 * />
 */
export const ProducerCard: React.FC<ProducerCardProps> = ({ 
  producer, 
  onSelect, 
  isSelected = false,
  className 
}) => {
  const handleClick = () => {
    onSelect?.(producer);
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{producer.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{producer.location.address}</span>
            </CardDescription>
          </div>
          {producer.accessibility?.wheelchairAccessible && (
            <Wheelchair className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {producer.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {producer.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {producer.hours.monday === 'Closed' 
              ? 'Check hours' 
              : `Open ${producer.hours.monday}`
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Example of memoized version for performance
export const MemoizedProducerCard = React.memo(ProducerCard);