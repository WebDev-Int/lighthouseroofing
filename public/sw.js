const CACHE_NAME = 'lighthouse-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/services.html',
  '/contact.html',
  '/assets/logo.png',
  '/assets/favicon.png',
  '/data/services.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isData = url.pathname.startsWith('/data/services.json');
  const isReviews = url.pathname.startsWith('/data/reviews.json');
  const isStatic = STATIC_ASSETS.includes(url.pathname);

  // Never cache reviews.json - always fetch fresh data
  if (isReviews) return;

  if (isStatic || isData) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}
