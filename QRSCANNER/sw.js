const CACHE_NAME = 'qrscanner-v1';
const URLS_TO_CACHE = [
  'qr-scanner.html',
  'manifest.json',
  'icon.png',
  'image.png',
  'https://unpkg.com/html5-qrcode'
  // Thêm các file khác nếu cần
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
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Nếu fetch thành công, cập nhật cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Nếu offline, lấy từ cache
        return caches.match(event.request);
      })
  );
});
