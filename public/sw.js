// Service Worker for LoomFrog PWA (Stale-While-Revalidate Strategy)
const CACHE_NAME = 'loomfrog-cache-v1';

// Static shell assets cached upon installation
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    })
  );
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

// Stale-While-Revalidate Caching for app assets, bypassing external AI APIs & CORS proxies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude non-GET requests, Gemini AI APIs, and dynamic CORS proxies
  if (
    event.request.method !== 'GET' ||
    url.hostname.includes('generativelanguage.googleapis.com') ||
    url.hostname.includes('allorigins.win') ||
    url.hostname.includes('corsproxy.io')
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and no network, return cached response if present
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
