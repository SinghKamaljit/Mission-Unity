const CACHE = 'mission-unity-v2';
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

// Shell files: network-first. Always try to fetch the latest version first
// (so edits to index.html / manifest.json / firebase-config.js show up on
// the very next load, not after a manual cache-clear), and only fall back
// to the cached copy if the network is unavailable (offline use).
// Firestore's own SDK calls are never touched here — they go straight to
// the network always, since chat/rooms need to be live, not cached.
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  const isShell = SHELL.some(s => url.pathname.endsWith(s.replace('./','')));
  if(!isShell) return;

  e.respondWith(
    fetch(e.request)
      .then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      })
      .catch(()=>caches.match(e.request))
  );
});
