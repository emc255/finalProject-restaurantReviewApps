const cacheName = "v1";

const cachedAssets = ["index.html", "restaurant.html", "./css/*.css", "./data/*.*", "./js/*.js", "./img/*.*"];

self.addEventListener("install", e => {
  console.log("installed");
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(cachedAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  console.log("activate");
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  console.log("fetch");
  console.log(e);
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
