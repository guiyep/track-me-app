/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

export const warn = <T>({ message }: { message: string }, object?: T) => {
  console.warn(message, object);
};

export const log = <T>({ message }: { message: string }, object?: T) => {
  console.log(message, object);
};

export const error = <T>({ message }: { message: string }, object?: T) => {
  console.error(message, object);
};
