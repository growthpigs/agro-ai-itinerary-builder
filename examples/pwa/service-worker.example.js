/**
 * Service Worker for AGRO AI Itinerary Builder PWA
 * Handles offline functionality, caching strategies, and background sync
 */

const CACHE_NAME = 'agro-ai-v1';
const DYNAMIC_CACHE = 'agro-ai-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/app.css',
  '/js/app.js',
  '/images/logo.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
];

// API endpoints to cache
const API_ROUTES = [
  '/api/producers',
  '/api/regions'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activate complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different request types
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Images - Cache First strategy
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else - Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Cache First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Cache first failed:', error);
    return caches.match(OFFLINE_URL);
  }
}

/**
 * Network First Strategy
 * Try network first, fall back to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Network first failed:', error);
    const cached = await caches.match(request);
    return cached || caches.match(OFFLINE_URL);
  }
}

/**
 * Stale While Revalidate Strategy
 * Serve from cache immediately, update cache in background
 */
async function staleWhileRevalidate(request) {
  try {
    const cached = await caches.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    });

    return cached || fetchPromise;
  } catch (error) {
    console.error('[Service Worker] Stale while revalidate failed:', error);
    return caches.match(OFFLINE_URL);
  }
}

// Background sync for offline itinerary saves
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-itineraries') {
    event.waitUntil(syncItineraries());
  }
});

/**
 * Sync offline itineraries when connection is restored
 */
async function syncItineraries() {
  try {
    // Get pending itineraries from IndexedDB
    const pending = await getPendingItineraries();
    
    for (const itinerary of pending) {
      try {
        const response = await fetch('/api/itineraries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(itinerary)
        });

        if (response.ok) {
          await removePendingItinerary(itinerary.id);
          // Notify user of successful sync
          await self.registration.showNotification('Itinerary Saved', {
            body: 'Your offline itinerary has been synchronized.',
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/badge-72x72.png'
          });
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync itinerary:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Background sync failed:', error);
  }
}

// Push notifications for events and updates
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  let data = {
    title: 'AGRO AI Update',
    body: 'Check out new producers in your area!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error('[Service Worker] Invalid push data:', error);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Producers',
        icon: '/images/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event.action);
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/producers')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for IndexedDB operations
async function getPendingItineraries() {
  // Implementation would interact with IndexedDB
  // This is a placeholder
  return [];
}

async function removePendingItinerary(id) {
  // Implementation would interact with IndexedDB
  // This is a placeholder
  return true;
}

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-producers') {
    event.waitUntil(updateProducersCache());
  }
});

async function updateProducersCache() {
  try {
    const response = await fetch('/api/producers');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/producers', response);
      console.log('[Service Worker] Producers cache updated');
    }
  } catch (error) {
    console.error('[Service Worker] Failed to update producers:', error);
  }
}