import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://174283ba9a37f15ae0536ce0b6a9812e@o4510868482097152.ingest.us.sentry.io/4510868540686336',
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [replayIntegration()],
});

// If you have a custom handleError function, pass it to handleErrorWithSentry
export const handleError = handleErrorWithSentry();
