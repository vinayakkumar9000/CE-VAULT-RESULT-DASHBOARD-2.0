// Service Worker Registration
// Non-invasive registration script for service worker

(function() {
  'use strict';

  // Only register if service workers are supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // Register the service worker
      navigator.serviceWorker
        .register('/CE-VAULT-RESULT-DASHBOARD-2.0/sw.js')
        .then(function(registration) {
          console.log('[SW] Registration successful:', registration.scope);
          
          // Check for updates periodically
          registration.addEventListener('updatefound', function() {
            const newWorker = registration.installing;
            console.log('[SW] Update found, installing new version');
            
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New version available, will activate on next page load');
              }
            });
          });
        })
        .catch(function(error) {
          console.log('[SW] Registration failed:', error);
        });
      
      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        if (refreshing) return;
        refreshing = true;
        console.log('[SW] Controller changed, reloading page');
        window.location.reload();
      });
    });
  } else {
    console.log('[SW] Service workers are not supported in this browser');
  }
})();
