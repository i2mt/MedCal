// Service Worker for MedCalc Pro PWA
// Cache name includes a build timestamp so it auto-busts on every deploy.
// To force a cache refresh for users: just redeploy — the timestamp changes automatically.
const BUILD_TIME = new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '');
const CACHE_NAME = `medcalc-pro-${BUILD_TIME}`;

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './converters.js',
    './drugDatabase.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap'
];

// Install: cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    // Don't skipWaiting here — let the page control activation
});

// Activate: delete all old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

// Fetch: cache-first for local assets, network-first for external
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const isLocal = url.origin === self.location.origin;

    if (isLocal) {
        // Cache-first for app shell
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            }))
        );
    } else {
        // Network-first for fonts/icons (graceful degradation to cache)
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    }
});

// Allow the page to trigger immediate activation of a new SW
self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
