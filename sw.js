const CACHE = 'mission-unity-v1';
const SHELL = ['./index.html', './manifest.json', './firebase-config.js'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

// Shell files: cache-first (works offline). Firestore's own SDK calls are
// never touched here — they go straight to the network, since chat/rooms
// need to be live, not cached.
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(SHELL.some(s => url.pathname.endsWith(s.replace('./','')))){
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
