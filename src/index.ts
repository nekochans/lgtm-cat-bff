import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './bindings';
import { handleFetchLgtmImagesInRandom } from './handlers/handleFetchLgtmImagesInRandom';
import { handleNotFound } from './handlers/handleNotFound';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => c.text('Hello! Hono!'));

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

app.all('*', (c) => {
  return handleNotFound({ url: c.req.url });
});

export default app;
