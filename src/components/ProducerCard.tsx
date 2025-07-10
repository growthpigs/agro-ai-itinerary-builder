import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Globe, Navigation, Plus, Check, Circle } from 'lucide-react';
import type { Producer } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useItinerary } from '@/hooks/useItinerary';
import { checkIfOpen } from '@/utils/hours';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { validateLink, logLinkClick } from '@/utils/linkValidator';

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

  // Validate all links on mount and when producer changes
  useEffect(() => {
    console.log(`[ProducerCard - ${producer.name}] Validating links...`);
    
    // Validate phone
    const phoneValidation = validateLink('phone', producer.phone, producer.name);
    if (!phoneValidation.isValid) console.warn(phoneValidation.warning);

    // Validate website
    const websiteValidation = validateLink('website', producer.website, producer.name);
    if (!websiteValidation.isValid) console.warn(websiteValidation.warning);

    // Validate maps (using coordinates)
    const mapsUrl = producer.location?.lat && producer.location?.lng 
      ? `https://www.google.com/maps/dir/?api=1&destination=${producer.location.lat},${producer.location.lng}`
      : null;
    const mapsValidation = validateLink('maps', mapsUrl, producer.name);
    if (!mapsValidation.isValid) console.warn(mapsValidation.warning);
  }, [producer]);

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
    logLinkClick(e, 'itinerary-button', 'N/A', producer.name);
    
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

  // Prepare validated links
  const phoneValidation = validateLink('phone', producer.phone, producer.name);
  const websiteValidation = validateLink('website', producer.website, producer.name);
  const mapsUrl = producer.location?.lat && producer.location?.lng 
    ? `https://www.google.com/maps/dir/?api=1&destination=${producer.location.lat},${producer.location.lng}`
    : null;
  const mapsValidation = validateLink('maps', mapsUrl, producer.name);
  const seeMoreValidation = validateLink('see-more', `/producer/${producer.id}`, producer.name);

  return (
    <TooltipProvider>
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
          <Link 
            to={`/producer/${producer.id}`}
            className="block aspect-[21/9] relative overflow-hidden bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              logLinkClick(e, 'banner-image', `/producer/${producer.id}`, producer.name);
            }}
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

        {/* Main content area that grows to push images/button down */}
        <div className="flex flex-col flex-grow p-6 gap-4">
          {/* Icon buttons row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* Phone Button */}
              {phoneValidation.isValid ? (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a 
                    href={phoneValidation.href}
                    onClick={(e) => {
                      e.stopPropagation();
                      logLinkClick(e, 'phone', phoneValidation.href, producer.name);
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              ) : producer.phone !== undefined && producer.phone !== null ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Invalid phone number</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Website Button */}
              {websiteValidation.isValid ? (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a 
                    href={websiteValidation.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      logLinkClick(e, 'website', websiteValidation.href, producer.name);
                    }}
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              ) : producer.website !== undefined && producer.website !== null ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Invalid website URL</p>
                  </TooltipContent>
                </Tooltip>
              ) : null}

              {/* Maps Button */}
              {mapsValidation.isValid ? (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <a 
                    href={mapsValidation.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      logLinkClick(e, 'maps', mapsValidation.href, producer.name);
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="opacity-50"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Location unavailable</p>
                  </TooltipContent>
                </Tooltip>
              )}
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
              <Link 
                to={seeMoreValidation.href}
                onClick={(e) => {
                  e.stopPropagation();
                  logLinkClick(e, 'see-more', seeMoreValidation.href, producer.name);
                }}
              >
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
                      logLinkClick(e, 'thumbnail', imageSlug, producer.name);
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
    </TooltipProvider>
  );
};