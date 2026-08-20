
// Bump this whenever PRECACHE_URLS changes so old caches get cleaned up.
const CACHE_NAME = 'hitech-cache-v2';
const OFFLINE_URL = '/offline.html';

// Only real, always-available static files here. The previous version
// listed '/globals.css', which isn't a real URL under Next.js (CSS ships
// as a hashed /_next/static chunk) — cache.addAll() is all-or-nothing, so
// that one bad entry silently failed the entire install and nothing ever
// got cached.
const PRECACHE_URLS = [OFFLINE_URL, '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Page navigations: always try the network first (so visitors get the
  // latest deployed content, not a stale cached page), and only fall back
  // to the offline page if the network request actually fails.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets (JS/CSS chunks, images, fonts): serve from cache if
  // already seen, otherwise fetch and opportunistically cache the result.
  // Nothing is precached by guessed filename here — Next.js's build
  // output is content-hashed and changes every deploy, so caching is
  // populated as the visitor actually uses the site.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
