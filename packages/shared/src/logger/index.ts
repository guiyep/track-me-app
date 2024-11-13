/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

export const warn = <T>({ message }: { message: string }, object?: T) => {
  console.warn(message, object);
};
