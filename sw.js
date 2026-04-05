const CACHE_NAME = 'carbon-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// 설치: 앱 파일을 캐시에 저장
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 실행: 인터넷 없어도 캐시에서 불러옴
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});