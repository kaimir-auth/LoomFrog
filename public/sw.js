// Minimal Passthrough Service Worker to satisfy PWA installability criteria
// No offline caching is performed to ensure all API requests and live content remain un-staled.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Passthrough without intercepting or caching
  event.respondWith(fetch(event.request));
});
