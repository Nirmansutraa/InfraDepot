/* NIRMASUTRA INFRA-DEPOT | SELF-UPDATING SERVICE WORKER 
  Version: 14.2
  Updated: 2026-03-08
*/

const CACHE_NAME = 'ns-infra-v14.2'; 
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// 1. INSTALL: Force the new worker to install immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing New Version...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Bypass the "waiting" room - take over immediately
  self.skipWaiting();
});

// 2. ACTIVATE: Kill old caches and claim control of all tabs
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating & Purging Old Caches...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Immediate control of the page without a manual refresh
  self.clients.claim();
});

// 3. FETCH: Network-First Strategy (Try internet, fallback to cache)
// This ensures you always get the latest code if online
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
