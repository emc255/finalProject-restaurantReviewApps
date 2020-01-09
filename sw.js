const cacheName = "v1";

const cachedAssets = [
  "index.html",
  "restaurant.html",
  "./css/styles.css",
  "./data/restaurants.json",
  "./js/dbhelper.js",
  "./js/main.js",
  "./js/restaurant_info.js",
  "./img/1.jpg",
  "./img/2.jpg",
  "./img/3.jpg",
  "./img/4.jpg",
  "./img/5.jpg",
  "./img/6.jpg",
  "./img/7.jpg",
  "./img/8.jpg",
  "./img/9.jpg",
  "./img/10.jpg"
];

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
