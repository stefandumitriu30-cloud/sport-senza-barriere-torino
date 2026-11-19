// Service worker: l'app si apre anche senza connessione (la mappa richiede internet).
const CACHE = "ssb-v4";
const SHELL = ["./", "index.html", "info.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png",
  "fonts/fonts.css", "fonts/atkinson-hyperlegible-latin-400-normal.woff2", "fonts/atkinson-hyperlegible-latin-700-normal.woff2",
  "vendor/leaflet/leaflet.css", "vendor/leaflet/leaflet.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Pagine dell'app: prima la rete (contenuti aggiornati), poi la copia salvata.
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
