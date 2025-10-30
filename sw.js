// Service Worker — cache app shell + vendor libs (vendored)
const CACHE_NAME = 'vault-app-shell-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  // vendor libs (local copies to guarantee offline)
  './libs/dexie.min.js',
  './libs/argon2.min.js',
  './libs/argon2.wasm',
  './libs/zxcvbn.js'
];

// On install: cache app shell and vendor libs
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Cache addAll failed (some items may be missing):', err);
      });
    })
  );
});

// On activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
        return Promise.resolve();
      })
    ))
  );
  self.clients.claim();
});

// Fetch: cache-first for same-origin assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // navigation (SPA) -> serve index.html from cache
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => cached || fetch(req).catch(()=>caches.match('./index.html')))
    );
    return;
  }

  // same-origin: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(networkResp => {
          // add to cache for future
          return caches.open(CACHE_NAME).then(cache => {
            try { cache.put(req, networkResp.clone()); } catch (e) {}
            return networkResp;
          });
        }).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // cross-origin: network-first with cache fallback (for any external CDN you might still use)
  event.respondWith(
    fetch(req).then(resp => resp).catch(() => caches.match(req))
  );
});

// Message handler to skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
