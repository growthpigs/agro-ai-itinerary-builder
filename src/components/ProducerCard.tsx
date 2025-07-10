import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe, Navigation, Plus, Check, Circle } from 'lucide-react';
import type { Producer } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useItinerary } from '@/hooks/useItinerary';
import { checkIfOpen } from '@/utils/hours';
import { ProducerImage } from '@/components/ui/ProducerImage';

interface ProducerCardProps {
  producer: Producer;
  distance?: number;
  onSelect?: (producer: Producer) => void;
  isSelected?: boolean;
  showDetails?: boolean;
}

export const ProducerCard: React.FC<ProducerCardProps> = ({ 
  producer, 
  distance,
  onSelect,
  isSelected = false,
  showDetails = true
}) => {
  const { addProducer, removeProducer, isProducerSelected, canAddMore } = useItinerary();
  const inItinerary = isProducerSelected(producer.id);
  const openStatus = checkIfOpen(producer.hours || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleClick = () => {
    if (onSelect) {
      onSelect(producer);
    }
  };

  const handleItineraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inItinerary) {
      removeProducer(producer.id);
    } else {
      if (!canAddMore) {
        // Could show a toast here
        alert('You can only add up to 4 producers to your itinerary');
        return;
      }
      addProducer(producer);
    }
  };

  return (
    <article
      className={cn(
        // CSS Grid container with explicit rows
        'bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-lg cursor-pointer',
        'grid grid-rows-[auto_1fr_auto_auto] h-full',
        isSelected && 'ring-2 ring-primary',
        onSelect && 'hover:border-primary'
      )}
      onClick={handleClick}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyPress={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          handleClick();
        }
      }}
    >
      {/* Row 1: Banner Image */}
      <header className="relative">
        <Link 
          to={`/producer/${producer.id}`}
          className="block aspect-[21/9] relative overflow-hidden bg-muted"
          onClick={(e) => e.stopPropagation()}
        >
          <ProducerImage
            producerSlug={`${producer.id}-${selectedImageIndex + 1}`}
            alt={producer.name}
            size="full"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {producer.featured && (
            <Badge className="absolute top-2 left-2">
              Featured
            </Badge>
          )}
          {distance && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              {distance}km
            </Badge>
          )}
          {inItinerary && (
            <Badge className="absolute bottom-2 left-2 bg-primary">
              <Check className="h-3 w-3 mr-1" />
              In Itinerary
            </Badge>
          )}
        </Link>
      </header>

      {/* Row 2: Main content (flexbox container that grows) */}
      <div className="flex flex-col p-6 gap-4">
        {/* Icon buttons row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {producer.phone && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a href={`tel:${producer.phone}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            )}
            {producer.website && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <a 
                  href={producer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${producer.location.lat},${producer.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4" />
              </a>
            </Button>
          </div>
          {/* Open/Closed indicator */}
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            openStatus.isOpen ? "text-green-600" : "text-red-600"
          )}>
            <Circle className={cn(
              "h-2 w-2 fill-current",
              openStatus.isOpen ? "text-green-600" : "text-red-600"
            )} />
            {openStatus.isOpen ? "Open" : "Closed"}
          </div>
        </div>

        {/* Title and description */}
        <div>
          <h3 className="leading-none font-semibold line-clamp-1">{producer.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {producer.description}
          </p>
        </div>

        {/* Categories and See more button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {producer.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
            {producer.categories.length > 3 && (
              <Badge variant="outline" className="bg-muted">
                +{producer.categories.length - 3}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            onClick={(e) => e.stopPropagation()}
            className="h-[22px] px-3 text-xs font-medium border-black hover:bg-gray-100 flex-shrink-0"
          >
            <Link to={`/producer/${producer.id}`}>
              See more
            </Link>
          </Button>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{producer.location.region}</span>
          </div>
          
          {producer.hours && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="truncate">{producer.hours}</span>
            </div>
          )}
        </div>

        {/* Tags - This will push down but stay in main content area */}
        {producer.tags && producer.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {producer.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Row 3: Image Gallery (anchored above button) */}
      {producer.images && producer.images.length > 0 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((num, index) => {
              const imageSlug = `${producer.id}-${num}`;
              
              return (
                <div 
                  key={num}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden bg-muted cursor-pointer transition-all relative",
                    selectedImageIndex === index && "ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                >
                  <ProducerImage
                    producerSlug={imageSlug}
                    alt={`${producer.name} - Image ${num}`}
                    size="thumb"
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Row 4: Add to Itinerary Button (always anchored at bottom) */}
      {showDetails && (
        <footer className="p-6 pt-0">
          <Button
            variant={inItinerary ? "outline" : "default"}
            size="lg"
            onClick={handleItineraryToggle}
            className={cn(
              "w-full gap-2 h-12",
              inItinerary 
                ? "bg-white hover:bg-gray-50 text-orange-600 border-orange-600" 
                : "bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
            )}
          >
            {inItinerary ? (
              <>
                <Check className="h-4 w-4" />
                Added to Itinerary
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Itinerary
              </>
            )}
          </Button>
        </footer>
      )}
    </article>
  );
};