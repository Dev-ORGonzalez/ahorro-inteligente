/* Ahorro Inteligente · service worker
   Cambia VERSION cada vez que subas cambios, para que el iPhone baje la versión nueva. */
const VERSION = 'ahorro-2026-11-05-2';
const SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png'];
const EXTERNOS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Nunca guardar en caché la cuenta ni los datos (Supabase): siempre van directo al servidor
  if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in') || /^\/(auth|rest|realtime|storage|functions)\/v1/.test(url.pathname)) return;
  // La página: primero internet (para recibir actualizaciones), si no hay, la copia guardada
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  const propio = url.origin === self.location.origin;
  if (!propio && !EXTERNOS.includes(url.hostname)) return;
  // Archivos propios, fuentes y la librería de Supabase: rápido desde caché y se actualiza por detrás
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req);
    const red = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || red;
  }));
});
