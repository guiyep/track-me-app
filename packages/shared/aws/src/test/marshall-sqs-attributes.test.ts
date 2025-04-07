import { marshallSqsAttributes } from '../index';

describe('marshallSqsAttributes', () => {
  it('should marshall string attributes', () => {
    const input = {
      stringKey: 'test value',
    };

    const result = marshallSqsAttributes(input);

    expect(result).toEqual({
      stringKey: {
        DataType: 'String',
        StringValue: 'test value',
      },
    });
  });

  it('should marshall number attributes', () => {
    const input = {
      numberKey: 123,
    };

    const result = marshallSqsAttributes(input);

    expect(result).toEqual({
      numberKey: {
        DataType: 'Number',
        StringValue: '123',
      },
    });
  });

  it('should marshall multiple attributes of different types', () => {
    const input = {
      stringKey: 'test value',
      numberKey: 123,
      anotherString: 'hello',
      anotherNumber: 456,
    };

    const result = marshallSqsAttributes(input);

    expect(result).toEqual({
      stringKey: {
        DataType: 'String',
        StringValue: 'test value',
      },
      numberKey: {
        DataType: 'Number',
        StringValue: '123',
      },
      anotherString: {
        DataType: 'String',
        StringValue: 'hello',
      },
      anotherNumber: {
        DataType: 'Number',
        StringValue: '456',
      },
    });
  });

  it('should handle empty object input', () => {
    const input = {};

    const result = marshallSqsAttributes(input);

    expect(result).toEqual({});
  });

  it('should ignore boolean values', () => {
    const input = {
      stringKey: 'test',
      boolKey: true,
      numberKey: 123,
    };

    const result = marshallSqsAttributes(input);

    expect(result).toEqual({
      stringKey: {
        DataType: 'String',
        StringValue: 'test',
      },
      numberKey: {
        DataType: 'Number',
        StringValue: '123',
      },
    });
  });
});
