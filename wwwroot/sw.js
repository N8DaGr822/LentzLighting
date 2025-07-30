const CACHE_NAME = 'lentz-lighting-v1';
const urlsToCache = [
    '/',
    '/css/app.css',
    '/js/app.js',
    '/favicon.png',
    '/images/placeholder.txt'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync any pending form submissions
        const pendingSubmissions = await getPendingSubmissions();
        for (const submission of pendingSubmissions) {
            await submitForm(submission);
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

async function getPendingSubmissions() {
    // Get pending submissions from IndexedDB
    return [];
}

async function submitForm(submission) {
    // Submit form data to server
    console.log('Submitting form:', submission);
} 