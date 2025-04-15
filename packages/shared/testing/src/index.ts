export type OmitProperties<T, K extends keyof T> = Omit<T, K>;

const removeNestedProperty = <T extends object>(obj: T, path: string[]): T => {
  if (path.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [path[0] as keyof T]: _, ...rest } = obj;
    return rest as T;
  }

  const [currentKey, ...remainingPath] = path;
  const currentValue = obj[currentKey as keyof T];

  if (currentValue === undefined || currentValue === null) {
    return obj;
  }

  return {
    ...obj,
    [currentKey]: removeNestedProperty(currentValue as object, remainingPath),
  };
};

export const omitProperties = <T extends object, K extends keyof T>(
  obj: T,
  propertiesToOmit: (K | string)[],
): OmitProperties<T, K> => {
  const directProperties = propertiesToOmit.filter(
    (prop): prop is K => typeof prop === 'string' && !prop.includes('.'),
  );
  const nestedProperties = propertiesToOmit.filter(
    (prop): prop is string => typeof prop === 'string' && prop.includes('.'),
  );

  let result = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !directProperties.includes(key as K)),
  ) as OmitProperties<T, K>;

  nestedProperties.forEach((path) => {
    result = removeNestedProperty(result, path.split('.'));
  });

  return result;
};
