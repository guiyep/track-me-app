import type { Request, Response, NextFunction } from 'express';
import {
  validateAll,
  validateItems,
  validateParams,
  validateBody,
} from '../validate';
import { logger } from '@track-me-app/logger';
import { z } from 'zod';
import type { ListBody } from '../../../src';

jest.mock('@track-me-app/logger');

interface TestParams {
  id?: string;
}

interface TestBody {
  name?: string;
  age?: number;
}

interface TestItemBody {
  value: string;
}

interface InvalidTestItemBody {
  value: number;
}

type MockRequest = Partial<Request<TestParams, unknown, TestBody>>;
type MockItemRequest = Partial<
  Request<TestParams, unknown, ListBody<TestItemBody>>
>;

describe('Validation Middlewares', () => {
  let mockReq: MockRequest;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockReq = {
      params: {},
      body: {},
    };

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    jest.clearAllMocks();
  });

  describe('validateAll', () => {
    const testSchema = z.object({
      id: z.string(),
      name: z.string(),
    });

    const validator = (data: unknown) => testSchema.parse(data);

    it('should pass validation and call next when data is valid', () => {
      mockReq.params = { id: '123' };
      mockReq.body = { name: 'test' };

      const middleware = validateAll(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        { message: 'validateAll: Request params' },
        { id: '123' },
      );
      expect(logger.log).toHaveBeenCalledWith(
        { message: 'validateAll: Request body' },
        { name: 'test' },
      );
    });

    it('should return 400 when validation fails', () => {
      mockReq.params = { id: '123' };
      // Using type assertion to simulate invalid data for testing
      mockReq.body = { name: 123 } as unknown as TestBody;

      const middleware = validateAll(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(logger.error).toHaveBeenCalledWith(
        { message: 'validateAll: failed' },
        expect.any(Error),
      );
    });
  });

  describe('validateItems', () => {
    const testSchema = z.object({
      value: z.string(),
    });

    const validator = (data: unknown) => testSchema.parse(data);
    let mockItemReq: MockItemRequest;

    beforeEach(() => {
      mockItemReq = {
        params: {},
        body: { items: [] },
      };
    });

    it('should pass validation when items are within limits and valid', () => {
      mockItemReq.body = {
        items: [{ value: 'test1' }, { value: 'test2' }],
      };

      const middleware = validateItems(validator, { min: 1, max: 3 });
      middleware(mockItemReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('should return 400 when items exceed max limit', () => {
      mockItemReq.body = {
        items: [
          { value: 'test1' },
          { value: 'test2' },
          { value: 'test3' },
          { value: 'test4' },
        ],
      };

      const middleware = validateItems(validator, { min: 1, max: 3 });
      middleware(mockItemReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: expect.anything() as string,
      });
    });

    it('should return 400 when items are below min limit', () => {
      mockItemReq.body = {
        items: [],
      };

      const middleware = validateItems(validator, { min: 1, max: 3 });
      middleware(mockItemReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it('should return 400 when any item fails validation', () => {
      const invalidItem: InvalidTestItemBody = { value: 123 };
      mockItemReq.body = {
        items: [{ value: 'test1' }, invalidItem as unknown as TestItemBody],
      };

      const middleware = validateItems(validator, { min: 1, max: 3 });
      middleware(mockItemReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe('validateParams', () => {
    const testSchema = z.object({
      id: z.string(),
    });

    const validator = (data: unknown) => testSchema.parse(data);

    it('should pass validation and call next when params are valid', () => {
      mockReq.params = { id: '123' };

      const middleware = validateParams(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        { message: 'validateParams: Request params' },
        { id: '123' },
      );
    });

    it('should return 400 when params validation fails', () => {
      // Using type assertion to simulate invalid data for testing
      mockReq.params = { id: 123 } as unknown as TestParams;

      const middleware = validateParams(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(logger.error).toHaveBeenCalledWith(
        { message: 'validateParams: failed' },
        expect.any(Error),
      );
    });
  });

  describe('validateBody', () => {
    const testSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const validator = (data: unknown) => testSchema.parse(data);

    it('should pass validation and call next when body is valid', () => {
      mockReq.body = {
        name: 'John',
        age: 30,
      };

      const middleware = validateBody(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        { message: 'validateBody: Request body' },
        { name: 'John', age: 30 },
      );
    });

    it('should return 400 when body validation fails', () => {
      // Using type assertion to simulate invalid data for testing
      mockReq.body = {
        name: 'John',
        age: 'thirty',
      } as unknown as TestBody;

      const middleware = validateBody(validator);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(logger.error).toHaveBeenCalledWith(
        { message: 'validateBody: failed' },
        expect.any(Error),
      );
    });
  });
});
