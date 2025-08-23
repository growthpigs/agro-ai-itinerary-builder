import type { Producer } from '@/types';

export type EventType = 
  | 'page_view'
  | 'itinerary_created'
  | 'itinerary_started'
  | 'itinerary_completed'
  | 'producer_selected'
  | 'producer_removed'
  | 'producer_viewed'
  | 'producer_visited'
  | 'navigation_opened'
  | 'session_started';

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
}

export interface AnalyticsSession {
  id: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  userAgent: string;
}

export interface AnalyticsData {
  sessions: AnalyticsSession[];
  version: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSession: AnalyticsSession | null = null;
  private readonly STORAGE_KEY = 'agro_analytics';
  private readonly STORAGE_VERSION = '1.0';

  private constructor() {
    this.initSession();
    this.setupBeforeUnload();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initSession(): void {
    this.currentSession = {
      id: this.generateId(),
      startTime: Date.now(),
      events: [],
      userAgent: navigator.userAgent,
    };
    
    this.track('session_started', {});
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  private endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.saveSession();
    }
  }

  private saveSession(): void {
    if (!this.currentSession) return;

    const data = this.getStoredData();
    data.sessions.push(this.currentSession);
    
    // Keep only last 1000 sessions to prevent storage overflow
    if (data.sessions.length > 1000) {
      data.sessions = data.sessions.slice(-1000);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private getStoredData(): AnalyticsData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AnalyticsData;
        if (parsed.version === this.STORAGE_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse analytics data:', error);
    }
    
    return {
      sessions: [],
      version: this.STORAGE_VERSION,
    };
  }

  public track(type: EventType, data: Record<string, any>): void {
    if (!this.currentSession) {
      this.initSession();
    }

    const event: AnalyticsEvent = {
      id: this.generateId(),
      type,
      timestamp: Date.now(),
      sessionId: this.currentSession!.id,
      data,
    };

    this.currentSession!.events.push(event);
    
    // Save session periodically
    if (this.currentSession!.events.length % 5 === 0) {
      this.saveSession();
    }
  }

  public getAnalytics(): AnalyticsData {
    // Ensure current session is saved
    if (this.currentSession) {
      this.saveSession();
    }
    return this.getStoredData();
  }

  public clearAnalytics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initSession();
  }

  // Analytics calculation methods
  public getTotalItineraries(): number {
    const data = this.getStoredData();
    return data.sessions.reduce((total, session) => {
      return total + session.events.filter(e => e.type === 'itinerary_created').length;
    }, 0);
  }

  public getCompletedItineraries(): number {
    const data = this.getStoredData();
    return data.sessions.reduce((total, session) => {
      return total + session.events.filter(e => e.type === 'itinerary_completed').length;
    }, 0);
  }

  public getCompletionRate(): number {
    const total = this.getTotalItineraries();
    const completed = this.getCompletedItineraries();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  public getMostSelectedProducers(): Array<{ producer: Producer; count: number }> {
    const data = this.getStoredData();
    const producerCounts = new Map<string, { producer: Producer; count: number }>();

    data.sessions.forEach(session => {
      session.events
        .filter(e => e.type === 'producer_selected')
        .forEach(event => {
          const producer = event.data.producer as Producer;
          if (producer) {
            const existing = producerCounts.get(producer.id);
            if (existing) {
              existing.count++;
            } else {
              producerCounts.set(producer.id, { producer, count: 1 });
            }
          }
        });
    });

    return Array.from(producerCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  public getMostCommonItineraries(): Array<{ producers: string[]; count: number }> {
    const data = this.getStoredData();
    const itineraryCounts = new Map<string, { producers: string[]; count: number }>();

    data.sessions.forEach(session => {
      session.events
        .filter(e => e.type === 'itinerary_created')
        .forEach(event => {
          const producers = event.data.producers as Producer[];
          if (producers && producers.length > 0) {
            const producerIds = producers.map(p => p.id).sort();
            const key = producerIds.join(',');
            const existing = itineraryCounts.get(key);
            if (existing) {
              existing.count++;
            } else {
              itineraryCounts.set(key, { producers: producerIds, count: 1 });
            }
          }
        });
    });

    return Array.from(itineraryCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  public getPageViews(): Array<{ path: string; count: number }> {
    const data = this.getStoredData();
    const pageCounts = new Map<string, number>();

    data.sessions.forEach(session => {
      session.events
        .filter(e => e.type === 'page_view')
        .forEach(event => {
          const path = event.data.path as string;
          if (path) {
            pageCounts.set(path, (pageCounts.get(path) || 0) + 1);
          }
        });
    });

    return Array.from(pageCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  }

  public getRecentSessions(limit: number = 50): AnalyticsSession[] {
    const data = this.getStoredData();
    return data.sessions
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit);
  }

  public getSessionsInPeriod(days: number = 7): AnalyticsSession[] {
    const data = this.getStoredData();
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return data.sessions.filter(session => session.startTime >= cutoff);
  }
}

export const analytics = AnalyticsService.getInstance();