import type { Request, Response } from 'express';
import { expressHandler } from '../express-handler';
import { InvalidOperation } from '@track-me-app/errors';
import { logger } from '@track-me-app/logger';

jest.mock('@track-me-app/logger', () => ({
  logger: {
    log: jest.fn(),
  },
}));

describe('expressHandler', () => {
  let mockRequest: Partial<Request<{ id: string }, void, { name: string }>>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      url: '/test',
      params: { id: '123' },
      body: { name: 'test' },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should handle successful request and return 200', async () => {
    const mockHandler = jest.fn().mockResolvedValue({ success: true });
    const wrappedHandler = expressHandler(mockHandler);

    await wrappedHandler(
      mockRequest as Request<{ id: string }, void, { name: string }>,
      mockResponse as Response,
    );

    expect(mockHandler).toHaveBeenCalledWith(
      mockRequest.params,
      mockRequest.body,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: { success: true },
    });
    expect(logger.log).toHaveBeenCalledTimes(2);
  });

  it('should handle InvalidOperation error and return 400', async () => {
    const mockHandler = jest
      .fn()
      .mockRejectedValue(
        new InvalidOperation({ message: 'Invalid operation' }),
      );
    const wrappedHandler = expressHandler(mockHandler);

    await wrappedHandler(
      mockRequest as Request<{ id: string }, void, { name: string }>,
      mockResponse as Response,
    );

    expect(mockHandler).toHaveBeenCalledWith(
      mockRequest.params,
      mockRequest.body,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(logger.log).toHaveBeenCalledTimes(3);
  });

  it('should handle unexpected error and return 500', async () => {
    const error = new Error('Unexpected error');
    const mockHandler = jest.fn().mockRejectedValue(error);
    const wrappedHandler = expressHandler(mockHandler);

    await wrappedHandler(
      mockRequest as Request<{ id: string }, void, { name: string }>,
      mockResponse as Response,
    );

    expect(mockHandler).toHaveBeenCalledWith(
      mockRequest.params,
      mockRequest.body,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error,
    });
    expect(logger.log).toHaveBeenCalledTimes(3);
  });

  it('should handle request with no body', async () => {
    const mockHandler = jest.fn().mockResolvedValue({ success: true });
    const wrappedHandler = expressHandler(mockHandler);
    mockRequest.body = undefined;

    await wrappedHandler(
      mockRequest as Request<{ id: string }, void, { name: string }>,
      mockResponse as Response,
    );

    expect(mockHandler).toHaveBeenCalledWith(mockRequest.params, undefined);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: { success: true },
    });
  });
});
