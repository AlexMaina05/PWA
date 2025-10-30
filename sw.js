// Service Worker (aggiornato): cache app shell + vendor libs + safe cache-bump handling
const CACHE_NAME = 'vault-app-shell-v3'; // incrementa qui ogni volta che pubblichi cambi importanti
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './libs/dexie.min.js',
  './libs/argon2.min.js',
  './libs/argon2.wasm',
  './libs/zxcvbn.js'
];

self.addEventListener('install', (event) => {
  console.log('[SW] install');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('[SW] cache.addAll failed (some items may be missing):', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) {
          console.log('[SW] deleting old cache', k);
          return caches.delete(k);
        }
        return Promise.resolve();
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // navigation -> serve index.html cached
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => cached || fetch(req).catch(()=>caches.match('./index.html')))
    );
    return;
  }

  // same-origin -> cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(netRes => {
          // try to cache for future
          return caches.open(CACHE_NAME).then(cache => {
            try { cache.put(req, netRes.clone()); } catch (e) { console.warn('[SW] cache.put failed', e); }
            return netRes;
          });
        }).catch(err => {
          console.warn('[SW] fetch failed for', req.url, err);
          return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // cross-origin -> network-first fallback to cache
  event.respondWith(
    fetch(req).then(resp => resp).catch(() => caches.match(req))
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] skip waiting requested');
    self.skipWaiting();
  }
});
