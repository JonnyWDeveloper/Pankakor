/*
 * För GET-anrop inom sidans egen scope hämtas senaste filen från nätverket först
 * och sparas i pannkakor-cache-v2. Vid nätverksfel används den cachade filen,
 * med index.html som reserv för sidnavigeringar. Därmed får besökare uppdaterat
 * innehåll utan att du behöver ändra cacheversionen vid varje publicering.
 *
 * Aktivering rensar bara appens egna gamla cacheposter och lämnar andra appars
 * cache orörd.
 */

/**
 * Service Worker för Pannkaksreceptet.
 * Hämtar uppdaterat innehåll från nätverket och använder cachen offline.
 */

const CACHE_PREFIX = 'pannkakor-cache-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const LEGACY_CACHE_NAME = 'pankakor-cache-v1';
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

// Hämta senaste versionen först och använd cachen om nätverket inte är tillgängligt.
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL(self.registration.scope);

  if (
    event.request.method !== 'GET' ||
    requestUrl.origin !== scopeUrl.origin ||
    !requestUrl.pathname.startsWith(scopeUrl.pathname)
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const response = await fetch(event.request);
        if (response.ok && response.type === 'basic') {
          try {
            await cache.put(event.request, response.clone());
          } catch {
            // Ett cachefel ska inte hindra ett lyckat nätverkssvar.
          }
        }
        return response;
      } catch {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          const cachedPage = await cache.match('./index.html');
          if (cachedPage) {
            return cachedPage;
          }
        }

        return Response.error();
      }
    })()
  );
});

// Rensa bara den här appens gamla cacheversioner.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames
        .filter(cacheName =>
          (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) ||
          cacheName === LEGACY_CACHE_NAME
        )
        .map(cacheName => caches.delete(cacheName))
    ))
  );
});
