import { global, warn, log, error, func } from '../index';

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
  });

  describe('func wrapper', () => {
    it('should log function execution start and completion', async () => {
      const testFunction = (param: string) => param.toUpperCase();
      const wrappedFunction = func(testFunction);

      const result = await wrappedFunction('test');

      expect(result).toBe('TEST');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Logging Function: "testFunction" start execution',
        JSON.stringify({ '0': 'test' }),
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Logging Function: "testFunction" has completed',
        JSON.stringify({ result: 'TEST', args: ['test'] }),
      );
    });

    it('should log error when function fails', async () => {
      const testError = new Error('Test error');
      const failingFunction = () => {
        throw testError;
      };
      const wrappedFunction = func(failingFunction);

      await expect(wrappedFunction()).rejects.toThrow(testError);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Logging Function: "failingFunction" start execution',
        JSON.stringify({}),
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Logging Function: "failingFunction" Failed',
        JSON.stringify({ e: testError, args: [] }),
      );
    });
  });
});
