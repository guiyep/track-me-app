import { userIdValidation } from '../validate-userid';

describe('emailValidation', () => {
  it('should validate correct userId format', () => {
    expect(() => {
      userIdValidation({ userId: 'test@example.com' });
    }).not.toThrow();
  });

  it('should throw error for invalid userId format', () => {
    expect(() => {
      userIdValidation({ userId: 'invalid-email' });
    }).not.toThrow();
  });

  it('should throw error for missing userId field', () => {
    expect(() => {
      userIdValidation({});
    }).toThrow();
  });

  it('should throw error for non-string userId', () => {
    expect(() => {
      userIdValidation({ userId: 123 });
    }).toThrow();
  });

  it('should throw error for null input', () => {
    expect(() => {
      userIdValidation(null);
    }).toThrow();
  });
});
