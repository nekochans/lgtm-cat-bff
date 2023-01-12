/**
 * @jest-environment jsdom
 */
import 'whatwg-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { mockUploadLgtmImage } from '../../mocks/api/mockUploadLgtmImage';
import { mockUploadLgtmImagePayloadTooLargeError } from '../../mocks/api/mockUploadLgtmImagePayloadTooLargeError';
import { mockUploadLgtmImageUnexpectedResponseBody } from '../../mocks/api/mockUploadLgtmImageUnexpectedResponseBody';
import { mockUploadLgtmImageUnprocessableEntityError } from '../../mocks/api/mockUploadLgtmImageUnprocessableEntityError';
import { isSuccessResult } from '../../result';
import { UploadLgtmImageError } from '../errors/UploadLgtmImageError';
import { UploadLgtmImagePayloadTooLargeError } from '../errors/UploadLgtmImagePayloadTooLargeError';
import { uploadLgtmImage } from '../uploadLgtmImage';

const apiUrl = 'https://api.example.com';

const mockHandlers = [rest.post(`${apiUrl}/lgtm-images`, mockUploadLgtmImage)];

const mockServer = setupServer(...mockHandlers);

// eslint-disable-next-line max-lines-per-function
describe('uploadLgtmImage TestCases', () => {
  beforeAll(() => {
    mockServer.listen();
  });

  afterEach(() => {
    mockServer.resetHandlers();
  });

  afterAll(() => {
    mockServer.close();
  });

  // eslint-disable-next-line max-lines-per-function
  it('should return createdLgtmImageUrl.', async () => {
    const expected = {
      createdLgtmImageUrl:
        'https://stg-lgtm-images.lgtmeow.com/2023/01/10/21/58cad97b-9732-4d71-8c50-ea2ea1f1cb51.webp',
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await uploadLgtmImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.jpeg' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return a UploadLgtmImagePayloadTooLargeError because the API returns 413', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/lgtm-images`,
        mockUploadLgtmImagePayloadTooLargeError
      )
    );

    const expected = {
      error: new UploadLgtmImagePayloadTooLargeError(
        'X-Request-Id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:X-Lambda-Request-Id:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
      ),
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await uploadLgtmImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeFalsy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return a ValidationErrorResponse because the API returns an unexpected response body', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/lgtm-images`,
        mockUploadLgtmImageUnexpectedResponseBody
      )
    );

    const expected = {
      invalidParams: [{ name: 'imageUrl', reason: 'Invalid url' }],
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await uploadLgtmImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeFalsy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should Throw UploadLgtmImageError because the API returns an unexpected error', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/lgtm-images`,
        mockUploadLgtmImageUnprocessableEntityError
      )
    );

    await expect(
      uploadLgtmImage({
        apiBaseUrl: apiUrl,
        accessToken: '',
        jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
      })
    ).rejects.toStrictEqual(
      new UploadLgtmImageError(
        'X-Request-Id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:X-Lambda-Request-Id:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
      )
    );
  });
});
