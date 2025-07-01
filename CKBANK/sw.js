const CACHE_NAME = 'bank-qr-cache-v1';
const urlsToCache = [
  './bank-qr.html',
  './sw.js',
  // Thêm các ảnh QR cần cache
  'https://img.vietqr.io/image/tpb-0867544809-compact2.png?accountName=TRAN%20MINH%20KHOA',
  'https://img.vietqr.io/image/tpb-40868442054-compact2.png?accountName=TRAN%20HOANG%20THAO%20VY'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
