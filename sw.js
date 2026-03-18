const CACHE_NAME = 'nirmansutra-v1';
const ASSETS = [
  'index.html',
  'admin.html',
  'survey.html',
  'manifest.json',
  'https://cdn.tailwindcss.com'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Fetch Offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
