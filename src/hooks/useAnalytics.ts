import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/services/analytics';
import type { EventType } from '@/services/analytics';
import type { Producer } from '@/types';

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically
  useEffect(() => {
    analytics.track('page_view', {
      path: location.pathname,
      timestamp: Date.now(),
    });
  }, [location.pathname]);

  const track = useCallback((type: EventType, data: Record<string, any> = {}) => {
    analytics.track(type, data);
  }, []);

  // Convenience methods for common events
  const trackItineraryCreated = useCallback((producers: Producer[]) => {
    track('itinerary_created', {
      producers,
      count: producers.length,
      producerIds: producers.map(p => p.id),
      categories: [...new Set(producers.flatMap(p => p.categories))],
    });
  }, [track]);

  const trackItineraryStarted = useCallback((producers: Producer[]) => {
    track('itinerary_started', {
      producers,
      count: producers.length,
      producerIds: producers.map(p => p.id),
    });
  }, [track]);

  const trackItineraryCompleted = useCallback((producers: Producer[], totalTime?: number) => {
    track('itinerary_completed', {
      producers,
      count: producers.length,
      producerIds: producers.map(p => p.id),
      totalTime,
    });
  }, [track]);

  const trackProducerSelected = useCallback((producer: Producer) => {
    track('producer_selected', {
      producer,
      producerId: producer.id,
      name: producer.name,
      categories: producer.categories,
      region: producer.location.region,
    });
  }, [track]);

  const trackProducerRemoved = useCallback((producer: Producer) => {
    track('producer_removed', {
      producer,
      producerId: producer.id,
      name: producer.name,
    });
  }, [track]);

  const trackProducerViewed = useCallback ((producer: Producer) => {
    track('producer_viewed', {
      producer,
      producerId: producer.id,
      name: producer.name,
      categories: producer.categories,
      region: producer.location.region,
    });
  }, [track]);

  const trackProducerVisited = useCallback((producer: Producer) => {
    track('producer_visited', {
      producer,
      producerId: producer.id,
      name: producer.name,
    });
  }, [track]);

  const trackNavigationOpened = useCallback((producer: Producer) => {
    track('navigation_opened', {
      producer,
      producerId: producer.id,
      name: producer.name,
      address: producer.location.address,
    });
  }, [track]);

  return {
    track,
    trackItineraryCreated,
    trackItineraryStarted,
    trackItineraryCompleted,
    trackProducerSelected,
    trackProducerRemoved,
    trackProducerViewed,
    trackProducerVisited,
    trackNavigationOpened,
  };
};