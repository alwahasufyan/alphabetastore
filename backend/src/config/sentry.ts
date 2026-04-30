/**
 * Sentry initialization — must be imported BEFORE any other module.
 * If SENTRY_DSN is not set the SDK is a no-op (no overhead).
 */
import * as Sentry from '@sentry/nestjs';

export function initSentry(dsn: string | undefined): void {
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Redact sensitive fields from breadcrumbs / request bodies
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }

      return event;
    },
  });
}
