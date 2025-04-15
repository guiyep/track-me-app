export const omit = <T extends object>(
  obj: T,
  properties: string[],
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => !properties.includes(key))
      .map(([key, value]) => [
        key,
        typeof value === 'object' ? omit(value, properties) : value,
      ]),
  ) as Partial<T>;
};
