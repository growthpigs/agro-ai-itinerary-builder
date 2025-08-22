// Force service worker update and cache clear
// Version: 2.2-thin-nav

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.update();
      console.log('[SW Update] Forcing update for:', registration.scope);
    }
  });
  
  // Clear all caches
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
      console.log('[SW Update] Deleted cache:', name);
    }
  });
  
  console.log('[SW Update] Cache cleared, version 2.2-thin-nav');
}