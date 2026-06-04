const CACHE_NAME = 'medcal-v1';

const APP_FILES = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/converters.js',
    '/drugDatabase.js',
    '/manifest.json'
];

// Install
self.addEventListener('install', event => {
    console.log('Service Worker installing...');

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
    );
});

// Activate
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {

    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {

                // Save fresh copy to cache
                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });

                return networkResponse;
            })
            .catch(() => {
                // Offline → serve cached version
                return caches.match(event.request);
            })
    );
});
