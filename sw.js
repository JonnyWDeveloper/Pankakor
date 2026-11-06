/**
 * Service Worker för Pannkaksreceptet (Pankakor)
 * Syfte: Cachar webbplatsens statiska tillgångar (HTML, CSS, bilder) i webbläsarens
 * lokala lagring (CacheStorage) för att ge blixtsnabba återbesök och offline-stöd.
 */

const CACHE_NAME = 'pankakor-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './images/webp/Pancake_Top.webp',
  './images/webp/Pancake_Bottom_Left.webp',
  './images/webp/Pancake_Bottom_Right.webp',
  './images/avif/Pancake_Top.avif',
  './images/avif/Pancake_Bottom_Left.avif',
  './images/avif/Pancake_Bottom_Right.avif',
  './images/png/Pancake_Top.png',
  './images/png/Pancake_Bottom_Left.png',
  './images/png/Pancake_Bottom_Right.png'
];

// Installationsfas: Laddar ner och sparar alla resurser i cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Hämtningsfas (Fetch): Intercepterar nätverksanrop och svarar med cachadfil om den finns
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Om filen finns i cachen, returnera den direkt (snabbare än nätverket)
        if (response) {
          return response;
        }
        // Annars hämta från nätverket
        return fetch(event.request);
      })
  );
});

// Aktiveringsfas: Rensar bort gamla cache-versioner när en ny version släpps
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
