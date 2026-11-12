/*
 * For GET requests within the page's scope, the latest file is fetched from the
 * network first and saved to pannkakor-cache-v2. If the network fails, the cached
 * file is used, with index.html as a fallback for page navigations. This keeps
 * visitors up to date without requiring a cache version change for every release.
 *
 * Activation only removes this app's old cache entries and leaves other apps'
 * caches untouched.
 */

/**
 * Service worker for the pancake recipe.
 * Fetches updated content from the network and uses the cache offline.
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

// Installation phase: download and store all resources in the cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch the latest version first and use the cache if the network is unavailable.
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
            // A cache error should not prevent a successful network response.
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

// Remove only this app's old cache versions.
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
