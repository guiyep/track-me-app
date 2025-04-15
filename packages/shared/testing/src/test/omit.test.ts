import { omit } from '../index';

describe('omit', () => {
  it('should omit specified properties from a flat object', () => {
    const input = {
      name: 'John',
      age: 30,
      city: 'New York',
    };

    const result = omit(input, ['age']);

    expect(result).toEqual({
      name: 'John',
      city: 'New York',
    });
  });

  it('should handle multiple properties to omit', () => {
    const input = {
      name: 'John',
      age: 30,
      city: 'New York',
      country: 'USA',
    };

    const result = omit(input, ['age', 'country']);

    expect(result).toEqual({
      name: 'John',
      city: 'New York',
    });
  });

  it('should handle nested objects', () => {
    const input = {
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
    };

    const result = omit(input, ['zip']);

    expect(result).toEqual({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'New York',
      },
    });
  });

  it('should handle deeply nested objects', () => {
    const input = {
      name: 'John',
      details: {
        personal: {
          age: 30,
          height: 180,
        },
        work: {
          company: 'Tech Corp',
          position: 'Developer',
        },
      },
    };

    const result = omit(input, ['age', 'position']);

    expect(result).toEqual({
      name: 'John',
      details: {
        personal: {
          height: 180,
        },
        work: {
          company: 'Tech Corp',
        },
      },
    });
  });

  it('should return an empty object when all properties are omitted', () => {
    const input = {
      name: 'John',
      age: 30,
    };

    const result = omit(input, ['name', 'age']);

    expect(result).toEqual({});
  });

  it('should return the original object when no properties are omitted', () => {
    const input = {
      name: 'John',
      age: 30,
    };

    const result = omit(input, []);

    expect(result).toEqual(input);
  });

  it('should handle non-existent properties to omit', () => {
    const input = {
      name: 'John',
      age: 30,
    };

    const result = omit(input, ['nonExistent']);

    expect(result).toEqual(input);
  });
});
