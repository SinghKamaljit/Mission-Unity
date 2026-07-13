const CACHE = "sakshi-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Shell files: cache-first. Everything else (Firebase calls etc.): network-first,
// falling back to cache only for previously-seen shell requests.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isShellRequest = SHELL.some((p) => url.pathname.endsWith(p.replace("./", "")));

  if (isShellRequest) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
  // Requests to Firebase/Google APIs: let them pass through untouched.
});
