// sw.js
self.addEventListener('push', function(event) {
  const options = {
    body: 'Este es un mensaje de prueba desde el Service Worker.',
    icon: 'https://via.placeholder.com/150', // Cambia esta URL por la de tu ícono
    badge: 'https://via.placeholder.com/50' // Cambia esta URL por la de tu ícono de badge
  };
  
  event.waitUntil(
    self.registration.showNotification('Notificación de prueba', options)
  );
});
