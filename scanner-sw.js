/* Label Scanner v2: keeps the page available without a network.
   Network first, so a phone that is online always gets the newest version;
   the cached copy is used only when the network fails.
   Only the files listed in SHELL are handled. Every other request on this site
   (the Manager, the current scanner) is left exactly as it was. */
const CACHE = 'label-scanner-v2-1';
const SHELL = ['scanner-v2.html', 'scanner.webmanifest', 'icons/scanner-180.png', 'icons/scanner-192.png', 'icons/scanner-512.png'];
const shellUrls = new Set(SHELL.map(p => { const u = new URL(p, self.location.href); return u.origin + u.pathname; }));

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(p => c.add(new Request(p, {cache: 'reload'})).catch(() => {}))))   // one missing file never blocks the rest
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('label-scanner-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url), key = u.origin + u.pathname;
  if (!shellUrls.has(key)) return;                       // not ours: the browser handles it as usual
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(key).then(hit => hit || Response.error()))
  );
});
