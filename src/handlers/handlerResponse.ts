import { type HttpStatusCode, httpStatusCode } from '../httpStatusCode';
import { type InvalidParams } from '../validator';

export type ResponseHeader = {
  'Content-Type': 'application/json';
  'Access-Control-Allow-Origin': string;
  'X-Request-Id'?: string;
  'X-Lambda-Request-Id'?: string;
};

export const createSuccessResponse = (
  body: unknown,
  statusCode: HttpStatusCode = httpStatusCode.ok,
  headers: ResponseHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
): Response => {
  const jsonBody = JSON.stringify(body);

  return new Response(jsonBody, { headers, status: statusCode });
};

export type ProblemDetails = {
  title: string;
  type: 'ResourceNotFound' | 'InternalServerError' | 'PayloadTooLarge';
  status?: HttpStatusCode;
  detail?: string;
};

export type ValidationProblemDetails = {
  title: 'unprocessable entity';
  type: 'ValidationError';
  status: HttpStatusCode;
  invalidParams: InvalidParams;
};

export const createErrorResponse = (
  problemDetails: ProblemDetails,
  statusCode: HttpStatusCode = httpStatusCode.internalServerError,
  headers: ResponseHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
): Response => createSuccessResponse(problemDetails, statusCode, headers);

export const createValidationErrorResponse = (
  invalidParams: InvalidParams,
  headers: ResponseHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
): Response => {
  const validationProblemDetails: ValidationProblemDetails = {
    title: 'unprocessable entity',
    type: 'ValidationError',
    status: httpStatusCode.unprocessableEntity,
    invalidParams,
  } as const;

  return createSuccessResponse(
    validationProblemDetails,
    httpStatusCode.unprocessableEntity,
    headers
  );
};
