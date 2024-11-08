const files = [
  'index.html',
  'caricaturas.html',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'images/',
  'https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg',
  'https://code.jquery.com/jquery-3.5.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
  'manifest.json'
]

self.addEventListener('install', function(event) {
  console.log('Instalando el Service Worker');

  // Cachea los archivos que necesites (por ejemplo, el HTML, CSS y JS)
  event.waitUntil(
    caches.open('my-cache-v1').then(function(cache) {
      return cache.addAll(files);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Interceptación de una solicitud:', event.request.url);

  // Intenta obtener el recurso del caché
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Si está en caché, devuélvelo
      if (response) {
        console.log('Obtenido de caché:', event.request.url);
        return response;
      }

      // Si no está en caché, obtenlo de la red
      return fetch(event.request).then(function(response) {
        console.log('Obtenido de la red:', event.request.url);

        // Guarda una copia del recurso en el caché
        caches.open('my-cache-v1').then(function(cache) {
          cache.put(event.request, response.clone());
        });

        return response;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activado el Service Worker');

  // Eliminar cachés viejos
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== 'my-cache-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});