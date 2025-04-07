import { emailValidation } from '../validate-email';

describe('emailValidation', () => {
  it('should validate correct email format', () => {
    expect(() => {
      emailValidation({ email: 'test@example.com' });
    }).not.toThrow();
  });

  it('should throw error for invalid email format', () => {
    expect(() => {
      emailValidation({ email: 'invalid-email' });
    }).toThrow();
  });

  it('should throw error for missing email field', () => {
    expect(() => {
      emailValidation({});
    }).toThrow();
  });

  it('should throw error for non-string email', () => {
    expect(() => {
      emailValidation({ email: 123 });
    }).toThrow();
  });

  it('should throw error for null input', () => {
    expect(() => {
      emailValidation(null);
    }).toThrow();
  });
});
