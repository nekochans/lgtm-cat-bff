import { ResponseResolver, MockedRequest, restContext } from 'msw';

import { httpStatusCode } from '../../httpStatusCode';

export const mockIsAcceptableCatImageUnexpectedResponseBody: ResponseResolver<
  MockedRequest,
  typeof restContext
> = (_req, res, ctx) =>
  res(
    ctx.status(httpStatusCode.ok),
    ctx.set('Content-Type', 'application/json'),
    ctx.set('X-request-Id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ctx.set('X-lambda-request-Id', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ctx.json({
      unknown: 'cat',
    })
  );
