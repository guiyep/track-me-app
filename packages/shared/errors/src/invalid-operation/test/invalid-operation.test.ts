import { InvalidOperation } from '../index';

describe('InvalidOperation', () => {
  it('should create an instance with the correct properties', () => {
    const message = 'Test error message';
    const error = new InvalidOperation({ message });

    expect(error).toBeInstanceOf(InvalidOperation);
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchSnapshot();
    expect(error.errorNumber).toBe(400);
    expect(error.type).toBe('InvalidOperation');
    expect(error.message).toBe(message);
  });

  it('should maintain the error stack trace', () => {
    const error = new InvalidOperation({ message: 'Test' });
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
