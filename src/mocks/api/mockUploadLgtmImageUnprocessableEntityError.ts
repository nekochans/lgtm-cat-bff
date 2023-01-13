import { ResponseResolver, MockedRequest, restContext } from 'msw';

import { httpStatusCode } from '../../httpStatusCode';

export const mockUploadLgtmImageUnprocessableEntityError: ResponseResolver<
  MockedRequest,
  typeof restContext
> = (_req, res, ctx) =>
  res(
    ctx.status(httpStatusCode.unprocessableEntity),
    ctx.set('Content-Type', 'application/json'),
    ctx.set('X-request-Id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ctx.set('X-lambda-request-Id', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
    ctx.json({
      message: 'Unprocessable Entity',
    })
  );
