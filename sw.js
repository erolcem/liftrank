// ════════════════════════════════════════════════════════
// sw.js — Service Worker (Cache-first for all assets)
// Bump CACHE_VERSION on every deploy to invalidate old cache.
// ════════════════════════════════════════════════════════

const CACHE_VERSION = 'liftrank-v3';

// All app shell assets (local)
const LOCAL_ASSETS = [
  './',
  './index.html',
  './app.js',
  './data/metrics.js',
  './engine/rank.js',
  './engine/storage.js',
  './engine/state.js',
  './ui/badge.js',
  './ui/bodygraph.js',
  './ui/progress.js',
  './ui/profile.js',
  './ui/sheet.js',
  './ui/toast.js',
  './ui/habits.js',
  './manifest.json',
];

// CDN assets — must be cached for full offline support
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js',
];

const ALL_ASSETS = [...LOCAL_ASSETS, ...CDN_ASSETS];

// ── INSTALL: pre-cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // Local assets — hard fail if missing
      const localPromise = cache.addAll(LOCAL_ASSETS);
      // CDN assets — soft fail (don't block install)
      const cdnPromises  = CDN_ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('[SW] CDN cache miss:', url, err))
      );
      return Promise.all([localPromise, ...cdnPromises]);
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first with network fallback
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      // Not in cache — fetch from network and cache the response
      return fetch(e.request).then(response => {
        // Only cache valid responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => cached); // Return stale cache on network error
    })
  );
});