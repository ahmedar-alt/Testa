import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: 'production',
      tracesSampleRate: 0.1,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
      ],
      beforeSend(event, hint) {
        // Filtrage des données sensibles
        if (event.request) {
          event.request = undefined;
        }
        return event;
      },
    });
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
}

export function setUser(user: { id?: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}