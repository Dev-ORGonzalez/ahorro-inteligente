/* Ahorro Inteligente · service worker
   Cambia VERSION cada vez que subas cambios, para que el iPhone baje la versión nueva. */
const VERSION = 'ahorro-2026-11-11-4';
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

// Consejo diario de Hannah (notificación push)
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  const title = d.title || '💡 Consejo de Hannah';
  e.waitUntil(self.registration.showNotification(title, { body: d.body || 'Abre la app y mira tu consejo de hoy.', icon: './icons/icon-192.png', badge: './icons/icon-192.png', tag: d.tag || 'hannah-consejo', data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => { for (const w of ws) { if ('focus' in w) { w.focus(); return; } } return self.clients.openWindow(url); }));
});
