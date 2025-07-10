import React, { useState } from 'react';
import { MapPin, Clock, Phone, Globe, Navigation, Plus, Check, Circle } from 'lucide-react';
import type { Producer } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useItinerary } from '@/hooks/useItinerary';
import { checkIfOpen } from '@/utils/hours';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { SafeLink } from '@/components/ui/SafeLink';

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

  // Create maps URL from coordinates
  const mapsUrl = producer.location?.lat && producer.location?.lng 
    ? `https://www.google.com/maps/dir/?api=1&destination=${producer.location.lat},${producer.location.lng}`
    : null;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card selection if clicking on a link or button
    const target = e.target as HTMLElement;
    const isInteractiveElement = 
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' ||
      target.closest('a') !== null ||
      target.closest('button') !== null;
    
    if (!isInteractiveElement && onSelect) {
      console.log(`[ProducerCard - ${producer.name}] Card clicked`);
      onSelect(producer);
    }
  };

  const handleItineraryToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`[ProducerCard - ${producer.name}] Itinerary button clicked`);
    
    if (inItinerary) {
      removeProducer(producer.id);
    } else {
      if (!canAddMore) {
        alert('You can only add up to 4 producers to your itinerary');
        return;
      }
      addProducer(producer);
    }
  };

  return (
      <article
        className={cn(
          // Flexbox container for vertical layout
          'bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-lg cursor-pointer',
          'flex flex-col h-full',
          isSelected && 'ring-2 ring-primary',
          onSelect && 'hover:border-primary'
        )}
        onClick={handleCardClick}
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyPress={(e) => {
          if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
            handleCardClick(e as any);
          }
        }}
      >
        {/* Banner Image */}
        <header className="relative">
          <SafeLink
            href={`/producer/${producer.id}`}
            type="internal"
            className="block aspect-[21/9] relative overflow-hidden bg-muted"
            producerName={producer.name}
            linkLabel="banner-image"
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
          </SafeLink>
        </header>

        {/* Main content area that grows to push images/button down */}
        <div className="flex flex-col flex-grow p-6 gap-4">
          {/* Icon buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Phone Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <SafeLink
                  href={producer.phone}
                  type="phone"
                  producerName={producer.name}
                  linkLabel="phone-button"
                  disabledMessage="Invalid phone number"
                >
                  <Phone className="h-4 w-4" />
                </SafeLink>
              </Button>

              {/* Website Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <SafeLink
                  href={producer.website}
                  type="external"
                  producerName={producer.name}
                  linkLabel="website-button"
                  disabledMessage="Invalid website URL"
                >
                  <Globe className="h-4 w-4" />
                </SafeLink>
              </Button>

              {/* Maps Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <SafeLink
                  href={mapsUrl}
                  type="external"
                  producerName={producer.name}
                  linkLabel="maps-button"
                  disabledMessage="Location unavailable"
                >
                  <Navigation className="h-4 w-4" />
                </SafeLink>
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
            <h3 className="leading-none font-semibold line-clamp-2">{producer.name}</h3>
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
              <SafeLink
                href={`/producer/${producer.id}`}
                type="internal"
                producerName={producer.name}
                linkLabel="see-more-button"
              >
                See more
              </SafeLink>
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

        {/* Image Gallery (anchored above button) */}
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
                      console.log(`[ProducerCard - ${producer.name}] Thumbnail clicked: ${imageSlug}`);
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

        {/* Add to Itinerary Button (always anchored at bottom) */}
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