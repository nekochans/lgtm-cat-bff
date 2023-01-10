import { z } from 'zod';
import { httpStatusCode } from '../httpStatusCode';
import { createFailureResult, createSuccessResult, Result } from '../result';
import { validation } from '../validator';
import { UploadLgtmImageError } from './errors/UploadLgtmImageError';
import type { JwtAccessToken } from './issueAccessToken';
import {
  LambdaRequestId,
  mightExtractRequestIds,
  RequestId,
} from './mightExtractRequestIds';
import {
  createValidationErrorResponse,
  ValidationErrorResponse,
} from './validationErrorResponse';

type Dto = {
  apiBaseUrl: string;
  accessToken: JwtAccessToken;
  jsonRequestBody: string;
};

export type UploadLgtmImageResponse = {
  imageUrl: `https://${string}`;
};

const uploadLgtmImageResponseSchema = z.object({
  imageUrl: z.string().url(),
});

const isUploadLgtmImageResponse = (
  value: unknown
): value is UploadLgtmImageResponse => {
  return validation(uploadLgtmImageResponseSchema, value).isValidate;
};

export type SuccessResponse = {
  createdLgtmImageUrl: `https://${string}`;
  xRequestId?: RequestId;
  xLambdaRequestId?: LambdaRequestId;
};

export type FailureResponse = {
  error: Error;
  xRequestId?: RequestId;
  xLambdaRequestId?: LambdaRequestId;
};

export const uploadLgtmImage = async (
  dto: Dto
): Promise<
  Result<SuccessResponse, FailureResponse | ValidationErrorResponse>
> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${dto.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: dto.jsonRequestBody,
  };

  const response = await fetch(`${dto.apiBaseUrl}/lgtm-images`, options);

  if (response.status !== httpStatusCode.accepted) {
    const requestIds = mightExtractRequestIds(response);

    throw new UploadLgtmImageError(
      `X-Request-Id=${String(
        requestIds.xRequestId
      )}:X-Lambda-Request-Id:${String(requestIds.xLambdaRequestId)}`
    );
  }

  const responseBody = await response.json();

  if (isUploadLgtmImageResponse(responseBody)) {
    const successResponse: SuccessResponse = {
      createdLgtmImageUrl: responseBody.imageUrl,
    };

    const requestIds = mightExtractRequestIds(response);

    return createSuccessResult<SuccessResponse>({
      ...successResponse,
      ...requestIds,
    });
  }

  const validationResult = validation(
    uploadLgtmImageResponseSchema,
    responseBody
  );
  if (!validationResult.isValidate && validationResult.invalidParams != null) {
    return createFailureResult<ValidationErrorResponse>(
      createValidationErrorResponse(validationResult.invalidParams, response)
    );
  }

  const requestIds = mightExtractRequestIds(response);

  throw new UploadLgtmImageError(
    `X-Request-Id=${String(requestIds.xRequestId)}:X-Lambda-Request-Id:${String(
      requestIds.xLambdaRequestId
    )}`
  );
};
