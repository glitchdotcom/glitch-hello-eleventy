/*
 * ServiceWorker to make site function as a PWA (Progressive Web App)
 *
 * Based on https://glitch.com/~pwa by https://glitch.com/@PaulKinlan
 */

try {
  // Specify what we want added to the cache for offline use
  self.addEventListener("install", e => {
    e.waitUntil(
      // Give the cache a name
      caches.open("hello-eleventy-pwa").then(cache => {
        // Add the homepage and stylesheet
        return cache.addAll(["/"]);
      })
    );
  });

  // Network falling back to cache approach - we update the cache each time we fetch
  // https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
  self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches.open("hello-eleventy-pwa").then(function(cache) {
        // Try fetching the page
        return fetch(event.request)
          .then(function(response) {
            // In case we don't have this in cache let's add it
            cache.put(event.request, response.clone()).catch(putErr => {
              // Sometimes we get temp method type errors during the build process
              console.log(putErr);
            });
            return response;
          })
          .catch(err => {
            // Fetch failed so return cache
            return caches.match(event.request).then(res => {
              // If we don't have a connection or cache for the page return the homepage
              return res || caches.match("/");
            });
          });
      })
    );
  });
} catch (error) {
  // Catch any errors we encounter during the build process
  console.log(error);
}
