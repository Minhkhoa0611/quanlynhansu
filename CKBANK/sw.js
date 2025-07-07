const CACHE_NAME = 'bankqr-v1';
const URLS_TO_CACHE = [
  '/',
  '/bank-qr.html',
  '/image.png',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
  // Thêm các file tĩnh khác nếu cần
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  // Nếu là request GET và là cùng origin
  if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Nếu fetch thành công, cập nhật cache và trả về bản mới nhất
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Nếu offline, trả về từ cache
          return caches.match(event.request);
        })
    );
  }
  // Nếu là request ngoài origin (CDN, API...), fallback về cache nếu offline
  else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
