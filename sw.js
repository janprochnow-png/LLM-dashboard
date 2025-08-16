const CACHE_NAME = 'llm-port-eur-v2';
const APP_SHELL = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE_NAME?null:caches.delete(k))))));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isData = url.pathname.startsWith('/.netlify/functions/');
  if (isData) e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  else e.respondWith(caches.match(e.request).then(resp => resp || fetch(e.request)));
});