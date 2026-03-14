const CACHE_NAME = 'infradepot-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/components/survey.html',
  '/css/components.css',
  '/js/app.js',
  '/manifest.json'
];

// Install: Save files to phone memory
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch: Serve files from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
