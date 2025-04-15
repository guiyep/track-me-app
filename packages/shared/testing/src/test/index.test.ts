import { omitProperties } from '../index';

describe('omitProperties', () => {
  describe('direct properties', () => {
    interface TestObject {
      id: string;
      name: string;
      age: number;
      email: string;
    }

    const testObject: TestObject = {
      id: '123',
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };

    it('should remove specified properties from the object', () => {
      const result = omitProperties(testObject, ['id', 'email']);

      expect(result).toEqual({
        name: 'John',
        age: 30,
      });

      // Verify the original object is not modified
      expect(testObject).toEqual({
        id: '123',
        name: 'John',
        age: 30,
        email: 'john@example.com',
      });
    });

    it('should return the same object if no properties are specified to omit', () => {
      const result = omitProperties(testObject, []);
      expect(result).toEqual(testObject);
    });

    it('should handle non-existent properties gracefully', () => {
      const result = omitProperties(testObject, [
        'nonExistent' as keyof TestObject,
      ]);
      expect(result).toEqual(testObject);
    });

    it('should remove single property', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitProperties(obj, ['a']);
      expect(result).toEqual({ b: 2, c: 3 });
    });

    it('should remove multiple properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omitProperties(obj, ['a', 'c']);
      expect(result).toEqual({ b: 2 });
    });

    it('should handle non-existent properties', () => {
      const obj = { a: 1, b: 2 };
      const result = omitProperties(obj, ['c']);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('nested properties', () => {
    it('should remove single nested property', () => {
      const obj = { a: { b: { c: 1 } }, d: 2 };
      const result = omitProperties(obj, ['a.b.c']);
      expect(result).toEqual({ a: { b: {} }, d: 2 });
    });

    it('should remove multiple nested properties', () => {
      const obj = { a: { b: { c: 1, d: 2 } }, e: 3 };
      const result = omitProperties(obj, ['a.b.c', 'a.b.d']);
      expect(result).toEqual({ a: { b: {} }, e: 3 });
    });

    it('should handle mixed direct and nested properties', () => {
      const obj = { a: { b: 1 }, c: 2, d: 3 };
      const result = omitProperties(obj, ['a.b', 'c']);
      expect(result).toEqual({ a: {}, d: 3 });
    });

    it('should handle deep nested objects', () => {
      const obj = { a: { b: { c: { d: { e: 1 } } } } };
      const result = omitProperties(obj, ['a.b.c.d.e']);
      expect(result).toEqual({ a: { b: { c: { d: {} } } } });
    });
  });

  describe('edge cases', () => {
    it('should handle empty object', () => {
      const obj = {};
      const result = omitProperties(obj, ['a']);
      expect(result).toEqual({});
    });

    it('should handle empty properties array', () => {
      const obj = { a: 1, b: 2 };
      const result = omitProperties(obj, []);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle null values in nested objects', () => {
      const obj = { a: { b: null } };
      const result = omitProperties(obj, ['a.b.c']);
      expect(result).toEqual({ a: { b: null } });
    });

    it('should handle undefined values in nested objects', () => {
      const obj = { a: { b: undefined } };
      const result = omitProperties(obj, ['a.b.c']);
      expect(result).toEqual({ a: { b: undefined } });
    });
  });
});
