/**
 * @file offline.ts
 * @description Utilities for offline detection and queue management
 */

/**
 * Check if the browser is currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Listen for online/offline events
 */
export const onOnlineStatusChange = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log('[Offline] Connection restored');
    onOnline();
  };

  const handleOffline = () => {
    console.log('[Offline] Connection lost');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Check if a service worker is supported and registered
 */
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

/**
 * Register the service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('[Service Worker] Not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[Service Worker] Registered successfully:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[Service Worker] New version available');
            // You can show a notification to the user here
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[Service Worker] Registration failed:', error);
    return null;
  }
};

/**
 * Unregister service worker (useful for development)
 */
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const unregistered = await registration.unregister();
    console.log('[Service Worker] Unregistered:', unregistered);
    return unregistered;
  } catch (error) {
    console.error('[Service Worker] Unregistration failed:', error);
    return false;
  }
};
