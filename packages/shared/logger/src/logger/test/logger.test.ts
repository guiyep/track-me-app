import {
  global,
  warn,
  log,
  error,
  asyncFunc,
  syncFunc,
  loggerDecorator,
} from '../index';

const getSnapshotName = (testName: string): string => {
  const folderName = 'logger';
  return `${folderName}/${testName}`;
};

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
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-status-active'),
      );
    });
  });

  describe('log function', () => {
    it('should log message without object', () => {
      log({ message: 'test message' });
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('log-without-object'),
      );
    });

    it('should log message with object', () => {
      const testObj = { key: 'value' };
      log({ message: 'test message' }, testObj);
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('log-with-object'),
      );
    });

    it('should log message with primitive value', () => {
      log({ message: 'test message' }, 123);
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('log-with-primitive'),
      );
    });

    it('should log message with name prefix', () => {
      log({ message: 'test message' }, undefined, 'TestModule');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('log-with-prefix'),
      );
    });

    it('should handle null object', () => {
      log({ message: 'test message' }, null);
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('log-with-null'),
      );
    });
  });

  describe('warn function', () => {
    it('should warn message without object', () => {
      warn({ message: 'test warning' });
      expect(consoleWarnSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('warn-without-object'),
      );
    });

    it('should warn message with object', () => {
      const testObj = { key: 'value' };
      warn({ message: 'test warning' }, testObj);
      expect(consoleWarnSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('warn-with-object'),
      );
    });

    it('should warn message with name prefix', () => {
      warn({ message: 'test warning' }, undefined, 'TestModule');
      expect(consoleWarnSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('warn-with-prefix'),
      );
    });
  });

  describe('error function', () => {
    it('should error message without object', () => {
      error({ message: 'test error' });
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('error-without-object'),
      );
    });

    it('should error message with error object', () => {
      const testError = new Error('test error');
      error({ message: 'test error' }, testError);
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('error-with-error-object'),
      );
    });

    it('should error message with name prefix', () => {
      error({ message: 'test error' }, undefined, 'TestModule');
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('error-with-prefix'),
      );
    });
  });

  describe('asyncFunc wrapper', () => {
    it('should log function execution start and completion', async () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = asyncFunc(testFunction);

      const result = await wrappedFunction('test');

      expect(result).toBe('TEST');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('async-func-success'),
      );
    });

    it('should log error when function fails', async () => {
      const testError = new Error('Test error');
      const failingFunction = () => {
        throw testError;
      };
      const wrappedFunction = asyncFunc(failingFunction);

      await expect(wrappedFunction()).rejects.toThrow(testError);
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('async-func-error-log'),
      );
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('async-func-error-error'),
      );
    });

    it('should use custom name when provided', async () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = asyncFunc(testFunction, 'CustomName');

      await wrappedFunction('test');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('async-func-custom-name'),
      );
    });
  });

  describe('syncFunc wrapper', () => {
    it('should log function execution start and completion', () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = syncFunc(testFunction);

      const result = wrappedFunction('test');

      expect(result).toBe('TEST');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('sync-func-success'),
      );
    });

    it('should log error when function fails', () => {
      const testError = new Error('Test error');
      const failingFunction = () => {
        throw testError;
      };
      const wrappedFunction = syncFunc(failingFunction);

      expect(() => wrappedFunction()).toThrow(testError);
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('sync-func-error-log'),
      );
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('sync-func-error-error'),
      );
    });

    it('should use custom name when provided', () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = syncFunc(testFunction, 'CustomName');

      wrappedFunction('test');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('sync-func-custom-name'),
      );
    });
  });

  describe('loggerDecorator', () => {
    it('should create logger with custom name', () => {
      const customLogger = loggerDecorator('TestModule');

      customLogger.log({ message: 'test message' });
      customLogger.warn({ message: 'test warning' });
      customLogger.error({ message: 'test error' });

      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-decorator-log'),
      );
      expect(consoleWarnSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-decorator-warn'),
      );
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-decorator-error'),
      );
    });

    it('should wrap async function with custom name', async () => {
      const customLogger = loggerDecorator('TestModule');
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = customLogger.asyncFunc(testFunction);

      await wrappedFunction('test');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-decorator-async'),
      );
    });

    it('should wrap sync function with custom name', () => {
      const customLogger = loggerDecorator('TestModule');
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = customLogger.syncFunc(testFunction);

      wrappedFunction('test');
      expect(consoleLogSpy.mock.calls).toMatchSnapshot(
        getSnapshotName('logger-decorator-sync'),
      );
    });
  });
});
