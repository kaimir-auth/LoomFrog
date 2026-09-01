// Service Worker for LoomFrog PWA
const CACHE_NAME = 'loomfrog-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Passthrough fetch handler to satisfy PWA criteria without aggressive offline breakage
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
