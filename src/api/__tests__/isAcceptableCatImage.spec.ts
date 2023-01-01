/**
 * @jest-environment jsdom
 */
import 'whatwg-fetch';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { mockInternalServerError } from '../../mocks/api/error/mockInternalServerError';
import { mockIsAcceptableCatImageNotAllowedImageExtension } from '../../mocks/api/mockIsAcceptableCatImageNotAllowedImageExtension';
import { mockIsAcceptableCatImageNotCatImage } from '../../mocks/api/mockIsAcceptableCatImageNotCatImage';
import { mockIsAcceptableCatImageNotModerationImage } from '../../mocks/api/mockIsAcceptableCatImageNotModerationImage';
import { mockIsAcceptableCatImagePersonFaceInTheImage } from '../../mocks/api/mockIsAcceptableCatImagePersonFaceInTheImage';
import { mockIsAcceptableCatImageTrue } from '../../mocks/api/mockIsAcceptableCatImageTrue';
import { mockIsAcceptableCatImageUnexpectedError } from '../../mocks/api/mockIsAcceptableCatImageUnexpectedError';
import { mockIsAcceptableCatImageUnexpectedResponseBody } from '../../mocks/api/mockIsAcceptableCatImageUnexpectedResponseBody';
import { isSuccessResult } from '../../result';
import { IsAcceptableCatImageError } from '../errors/IsAcceptableCatImageError';
import { isAcceptableCatImage } from '../isAcceptableCatImage';

const apiUrl = 'https://api.example.com';

const mockHandlers = [
  rest.post(
    `${apiUrl}/cat-images/validation-results`,
    mockIsAcceptableCatImageTrue
  ),
];

const mockServer = setupServer(...mockHandlers);

// eslint-disable-next-line max-lines-per-function
describe('isAcceptableCatImage TestCases', () => {
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
  it('should return isAcceptableCatImage as true', async () => {
    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: true,
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.jpeg' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return isAcceptableCatImage as false because not allowed image extension', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImageNotAllowedImageExtension
      )
    );

    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: false,
        notAcceptableReason: 'not an allowed image extension',
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.webp' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return isAcceptableCatImage as false because not moderation image', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImageNotModerationImage
      )
    );

    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: false,
        notAcceptableReason: 'not moderation image',
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return isAcceptableCatImage as false because person face in the image', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImagePersonFaceInTheImage
      )
    );

    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: false,
        notAcceptableReason: 'person face in the image',
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return isAcceptableCatImage as false because not cat image', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImageNotCatImage
      )
    );

    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: false,
        notAcceptableReason: 'not cat image',
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return isAcceptableCatImage as false because unexpected error', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImageUnexpectedError
      )
    );

    const expected = {
      isAcceptableCatImageResponse: {
        isAcceptableCatImage: false,
        notAcceptableReason: 'an error has occurred',
      },
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeTruthy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should return a ValidationErrorResponse because the API returns an unexpected response body', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockIsAcceptableCatImageUnexpectedResponseBody
      )
    );

    const expected = {
      invalidParams: [{ name: 'isAcceptableCatImage', reason: 'Required' }],
      xRequestId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      xLambdaRequestId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    };

    const result = await isAcceptableCatImage({
      apiBaseUrl: apiUrl,
      accessToken: '',
      jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
    });

    expect(isSuccessResult(result)).toBeFalsy();
    expect(result.value).toStrictEqual(expected);
  });

  it('should Throw IsAcceptableCatImageError because the API returns an unexpected error', async () => {
    mockServer.use(
      rest.post(
        `${apiUrl}/cat-images/validation-results`,
        mockInternalServerError
      )
    );

    await expect(
      isAcceptableCatImage({
        apiBaseUrl: apiUrl,
        accessToken: '',
        jsonRequestBody: JSON.stringify({ image: '', imageExtension: '.png' }),
      })
    ).rejects.toStrictEqual(
      new IsAcceptableCatImageError(
        'X-Request-Id=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:X-Lambda-Request-Id:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
      )
    );
  });
});
