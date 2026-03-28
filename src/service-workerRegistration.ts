interface ServiceWorkerRegistrationParams {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

function registerServiceWorker(params?: ServiceWorkerRegistrationParams) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        console.log('SW registered: ', registration);

        if (params?.onSuccess) {
          params.onSuccess(registration);
        }

        // Check for updates
        if (registration.waiting) {
          if (params?.onUpdate) {
            params.onUpdate(registration);
          }
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                if (params?.onUpdate) {
                  params.onUpdate(registration);
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('SW registration failed: ', error);
      }
    });
  }
}