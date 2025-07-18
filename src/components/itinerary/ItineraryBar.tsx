import React, { useState } from 'react';
import { X, MapPin, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useItinerary } from '@/hooks/useItinerary';
import { Button } from '@/components/ui/button';
import { SafeLink } from '@/components/ui/SafeLink';
import { ProducerImage } from '@/components/ui/ProducerImage';
import { cn } from '@/lib/utils';

export const ItineraryBar: React.FC = () => {
  const { selectedProducers, removeProducer, maxProducers } = useItinerary();
  const [isExpanded, setIsExpanded] = useState(true);

  if (selectedProducers.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-background border-t shadow-lg">
        <div className="container mx-auto px-4">
          <div className={cn(
            "transition-all duration-300",
            isExpanded ? "py-4" : "py-2"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-left hover:opacity-70 transition-opacity"
                >
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    Your Itinerary ({selectedProducers.length}/{maxProducers})
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                  </h3>
                  {isExpanded && (
                    <p className="text-xs text-muted-foreground">
                      {maxProducers - selectedProducers.length > 0 
                        ? `Add ${maxProducers - selectedProducers.length} more stops`
                        : 'Ready to create your tour!'}
                    </p>
                  )}
                </button>
              </div>
              <Button asChild size="sm" className="gap-2" onClick={() => setIsExpanded(false)}>
                <SafeLink 
                  href="/itinerary"
                  type="internal"
                  producerName="ItineraryBar"
                  linkLabel="view-itinerary"
                >
                  View Itinerary
                  <ArrowRight className="h-4 w-4" />
                </SafeLink>
              </Button>
            </div>

            {/* Selected Producers */}
            {isExpanded && (
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {selectedProducers.map((producer, index) => (
                <div
                  key={producer.id}
                  className="flex-shrink-0 relative group animate-in zoom-in-50 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden rounded-lg border bg-card w-40">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <ProducerImage
                        producerSlug={`${producer.id}-1`}
                        alt={producer.name}
                        size="thumb"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Remove button */}
                      <button
                        onClick={() => removeProducer(producer.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${producer.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>

                      {/* Order badge */}
                      <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <h4 className="text-xs font-medium line-clamp-1">{producer.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {producer.location.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add more placeholder */}
              {selectedProducers.length < maxProducers && (
                <SafeLink 
                  href="/producers"
                  type="internal"
                  className="flex-shrink-0 w-40 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center aspect-square hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  producerName="ItineraryBar"
                  linkLabel="add-more-producers"
                >
                  <div className="text-center">
                    <MapPin className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Add {maxProducers - selectedProducers.length} more
                    </p>
                  </div>
                </SafeLink>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};