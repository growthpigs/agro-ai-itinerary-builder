import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Producer } from '@/types';
import { analytics } from '@/services/analytics';

interface ItineraryContextType {
  selectedProducers: Producer[];
  addProducer: (producer: Producer) => boolean;
  removeProducer: (producerId: string) => void;
  clearItinerary: () => void;
  isProducerSelected: (producerId: string) => boolean;
  canAddMore: boolean;
  maxProducers: number;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

const MAX_PRODUCERS = 4;

export const ItineraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducers, setSelectedProducers] = useState<Producer[]>([]);

  const addProducer = useCallback((producer: Producer): boolean => {
    if (selectedProducers.length >= MAX_PRODUCERS) {
      return false;
    }
    
    if (selectedProducers.some(p => p.id === producer.id)) {
      return false;
    }

    setSelectedProducers(prev => {
      const updated = [...prev, producer];
      
      // Track producer selection
      analytics.track('producer_selected', {
        producer,
        producerId: producer.id,
        name: producer.name,
        categories: producer.categories,
        region: producer.location.region,
        totalSelected: updated.length,
      });
      
      // Track itinerary creation when we have multiple producers
      if (updated.length > 1) {
        analytics.track('itinerary_created', {
          producers: updated,
          count: updated.length,
          producerIds: updated.map(p => p.id),
          categories: [...new Set(updated.flatMap(p => p.categories))],
        });
      }
      
      return updated;
    });
    return true;
  }, [selectedProducers]);

  const removeProducer = useCallback((producerId: string) => {
    setSelectedProducers(prev => {
      const producerToRemove = prev.find(p => p.id === producerId);
      const updated = prev.filter(p => p.id !== producerId);
      
      // Track producer removal
      if (producerToRemove) {
        analytics.track('producer_removed', {
          producer: producerToRemove,
          producerId: producerToRemove.id,
          name: producerToRemove.name,
          remainingCount: updated.length,
        });
      }
      
      return updated;
    });
  }, []);

  const clearItinerary = useCallback(() => {
    setSelectedProducers([]);
  }, []);

  const isProducerSelected = useCallback((producerId: string): boolean => {
    return selectedProducers.some(p => p.id === producerId);
  }, [selectedProducers]);

  const value: ItineraryContextType = {
    selectedProducers,
    addProducer,
    removeProducer,
    clearItinerary,
    isProducerSelected,
    canAddMore: selectedProducers.length < MAX_PRODUCERS,
    maxProducers: MAX_PRODUCERS,
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};