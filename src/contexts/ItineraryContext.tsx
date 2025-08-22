import React, { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Producer } from '@/types';

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

    setSelectedProducers(prev => [...prev, producer]);
    return true;
  }, [selectedProducers]);

  const removeProducer = useCallback((producerId: string) => {
    setSelectedProducers(prev => prev.filter(p => p.id !== producerId));
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