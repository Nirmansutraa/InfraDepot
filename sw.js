/* NIRMASUTRA INFRA-DEPOT BI-SYSTEM 
   SERVICE WORKER PROTOCOL: NSIDBS03
   LAST UPDATED: 2026-03-08
*/

const CACHE_NAME = 'nsidbs-v03-enterprise';

// Resources to be cached for offline availability
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

// INSTALL: Pre-cache all essential system files
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('NSIDBS03: System files locked in cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ACTIVATE: The "Version Purge" logic
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('NSIDBS: Purging Legacy Version Cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// FETCH: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests for maps (OSM tiles) to avoid CORS bloat,
    // only cache the core library files.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Return offline fallback if network fails
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
