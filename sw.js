const CACHE_NAME = 'yely-v14';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Ne jamais cacher : HTML, API Supabase, requêtes cross-origin
  if (url.origin !== self.location.origin || url.pathname.endsWith('.html')) {
    return; // laisse le navigateur gérer normalement
  }
  // Fonts Google : cache-first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
      return res;
    }))
  );
});
