const CACHE_NAME = "medina-render-ai-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", function(event) {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        fetch(event.request)
        .then(function(response) {

            const responseClone = response.clone();

            caches.open(CACHE_NAME)
            .then(function(cache) {
                cache.put(
                    event.request,
                    responseClone
                );
            });

            return response;
        })
        .catch(function() {
            return caches.match(event.request);
        })
    );
});
