// Guarda la app en el celular para abrirla sin señal. Al haber señal, baja la versión nueva para la siguiente vez.
const CACHE = "asistencia-v26";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icono-192.png", "icono-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // Drive y WhatsApp van directo a internet
  e.respondWith(caches.open(CACHE).then(async c => {
    const guardado = await c.match(e.request, {ignoreSearch: true});
    const red = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => guardado);
    return guardado || red;
  }));
});
