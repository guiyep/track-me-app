import {
  global,
  warn,
  log,
  error,
  asyncFunc,
  syncFunc,
  withLogger,
} from '../index';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.setLoggerStatus(true);
  });

  describe('logger status', () => {
    it('should not log when logger is inactive', () => {
      global.setLoggerStatus(false);
      log({ message: 'test message' });
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log when logger is active', () => {
      global.setLoggerStatus(true);
      log({ message: 'test message' });
      expect(consoleLogSpy).toHaveBeenCalledWith('test message');
    });
  });

  describe('log function', () => {
    it('should log message without object', () => {
      log({ message: 'test message' });
      expect(consoleLogSpy).toHaveBeenCalledWith('test message');
    });

    it('should log message with object', () => {
      const testObj = { key: 'value' };
      log({ message: 'test message' }, testObj);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'test message',
        JSON.stringify(testObj),
      );
    });

    it('should log message with primitive value', () => {
      log({ message: 'test message' }, 123);
      expect(consoleLogSpy).toHaveBeenCalledWith('test message', 123);
    });

    it('should log message with name prefix', () => {
      log({ message: 'test message' }, undefined, 'TestModule');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Log: TestModule - test message',
      );
    });

    it('should handle null object', () => {
      log({ message: 'test message' }, null);
      expect(consoleLogSpy).toHaveBeenCalledWith('test message');
    });
  });

  describe('warn function', () => {
    it('should warn message without object', () => {
      warn({ message: 'test warning' });
      expect(consoleWarnSpy).toHaveBeenCalledWith('test warning');
    });

    it('should warn message with object', () => {
      const testObj = { key: 'value' };
      warn({ message: 'test warning' }, testObj);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'test warning',
        JSON.stringify(testObj),
      );
    });

    it('should warn message with name prefix', () => {
      warn({ message: 'test warning' }, undefined, 'TestModule');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warn: TestModule - test warning',
      );
    });
  });

  describe('error function', () => {
    it('should error message without object', () => {
      error({ message: 'test error' });
      expect(consoleErrorSpy).toHaveBeenCalledWith('test error');
    });

    it('should error message with object', () => {
      const testObj = { key: 'value' };
      error({ message: 'test error' }, testObj);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'test error',
        JSON.stringify(testObj),
      );
    });

    it('should error message with name prefix', () => {
      error({ message: 'test error' }, undefined, 'TestModule');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'ErrorLog: TestModule - test error',
      );
    });
  });

  describe('asyncFunc wrapper', () => {
    it('should log function execution start and completion', async () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = asyncFunc(testFunction);

      const result = await wrappedFunction('test');

      expect(result).toBe('TEST');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Async Function: "testFunction" start execution',
        JSON.stringify({ '0': 'test' }),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Async Function: "testFunction" has completed',
        JSON.stringify({ result: 'TEST', args: ['test'] }),
      );
    });

    it('should log error when function fails', async () => {
      const testError = new Error('Test error');
      const failingFunction = () => {
        throw testError;
      };
      const wrappedFunction = asyncFunc(failingFunction);

      await expect(wrappedFunction()).rejects.toThrow(testError);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Async Function: "failingFunction" start execution',
        JSON.stringify({}),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Async Function: "failingFunction" Failed',
        JSON.stringify({ e: testError, args: [] }),
      );
    });

    it('should use custom name when provided', async () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = asyncFunc(testFunction, 'CustomName');

      await wrappedFunction('test');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Async Function: "CustomName" start execution',
        JSON.stringify({ '0': 'test' }),
      );
    });
  });

  describe('syncFunc wrapper', () => {
    it('should log function execution start and completion', () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = syncFunc(testFunction);

      const result = wrappedFunction('test');

      expect(result).toBe('TEST');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Sync Function: "testFunction" start execution',
        JSON.stringify({ '0': 'test' }),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Sync Function: "testFunction" has completed',
        JSON.stringify({ result: 'TEST', args: ['test'] }),
      );
    });

    it('should log error when function fails', () => {
      const testError = new Error('Test error');
      const failingFunction = () => {
        throw testError;
      };
      const wrappedFunction = syncFunc(failingFunction);

      expect(() => wrappedFunction()).toThrow(testError);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Sync Function: "failingFunction" start execution',
        JSON.stringify({}),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Sync Function: "failingFunction" Failed',
        JSON.stringify({ e: testError, args: [] }),
      );
    });

    it('should use custom name when provided', () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = syncFunc(testFunction, 'CustomName');

      wrappedFunction('test');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Sync Function: "CustomName" start execution',
        JSON.stringify({ '0': 'test' }),
      );
    });
  });

  describe('withLogger', () => {
    it('should create logger with custom name', () => {
      const customLogger = withLogger('TestModule');

      customLogger.log('test message');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Log: TestModule - test message',
      );

      customLogger.warn('test warning');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Warn: TestModule - test warning',
      );

      customLogger.error('test error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'ErrorLog: TestModule - test error',
      );
    });

    it('should wrap async function with custom name', async () => {
      const customLogger = withLogger('TestModule');
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = customLogger.asyncFunc(testFunction);

      await wrappedFunction('test');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Async Function: "TestModule" start execution',
        JSON.stringify({ '0': 'test' }),
      );
    });

    it('should wrap sync function with custom name', () => {
      const customLogger = withLogger('TestModule');
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = customLogger.syncFunc(testFunction);

      wrappedFunction('test');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Sync Function: "TestModule" start execution',
        JSON.stringify({ '0': 'test' }),
      );
    });
  });
});
