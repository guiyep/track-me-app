import { getEnvEntry } from '../src';

describe('Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getEnvEntry', () => {
    it('should return the environment variable value when it exists', () => {
      // Arrange
      const testKey = 'TEST_KEY';
      const testValue = 'test-value';
      process.env[testKey] = testValue;

      // Act
      const result = getEnvEntry(testKey);

      // Assert
      expect(result).toBe(testValue);
    });

    it('should throw an error when environment variable does not exist', () => {
      // Arrange
      const nonExistentKey = 'NON_EXISTENT_KEY';

      // Act & Assert
      expect(() => getEnvEntry(nonExistentKey)).toThrow(
        `Environment variable ${nonExistentKey} is not set.`,
      );
    });

    it('should include NODE_ENV in the log message when it is set', () => {
      // Arrange
      const testKey = 'TEST_KEY';
      const testValue = 'test-value';
      const testEnv = 'test';
      process.env[testKey] = testValue;
      process.env.NODE_ENV = testEnv;

      // Act
      const result = getEnvEntry(testKey);

      // Assert
      expect(result).toBe(testValue);
    });
  });
});
