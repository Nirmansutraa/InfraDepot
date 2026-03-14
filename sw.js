const CACHE_NAME = 'infra-depot-v2-2026';
const OFFLINE_URLS = [
    './',
    './index.html',
    './css/components.css',
    './js/auth.js',
    './js/app.js',
    './js/ui.js',
    './js/map.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
    );
});

// Advanced Network-First for Auth, Cache-First for Assets
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
