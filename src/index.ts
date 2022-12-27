import { getSentry, sentry } from '@honojs/sentry';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Bindings } from './bindings';
import { handleFetchLgtmImagesInRandom } from './handlers/handleFetchLgtmImagesInRandom';
import { handleNotFound } from './handlers/handleNotFound';
import type { ProblemDetails } from './handlers/handlerResponse';
import { httpStatusCode } from './httpStatusCode';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', async (c, next) => {
  const handler = sentry({ dsn: c.env.SENTRY_DSN });

  await handler(c, next);
});

app.use('*', async (c, next) => {
  const handler =
    c.env.APP_ENV === 'production'
      ? cors({ origin: 'https://lgtmeow.com' })
      : cors();

  await handler(c, next);
});

app.get('/lgtm-images', async (c) => {
  return await handleFetchLgtmImagesInRandom({
    env: {
      cognitoTokenEndpoint: c.env.COGNITO_TOKEN_ENDPOINT,
      cognitoClientId: c.env.COGNITO_CLIENT_ID,
      cognitoClientSecret: c.env.COGNITO_CLIENT_SECRET,
      apiBaseUrl: c.env.LGTMEOW_API_URL,
      cacheClient: c.env.COGNITO_TOKEN,
    },
  });
});

app.onError((error, c) => {
  const problemDetails: ProblemDetails = {
    title: error.name,
    type: 'InternalServerError',
    status: httpStatusCode.internalServerError,
  } as const;

  const sentryHandler = getSentry(c);
  sentryHandler.setTag('requestIds', error.message);
  sentryHandler.setTag('environment', c.env.APP_ENV);
  sentryHandler.captureException(error);

  return c.json(problemDetails, httpStatusCode.internalServerError);
});

app.all('*', (c) => {
  return handleNotFound({ url: c.req.url });
});

export default app;
