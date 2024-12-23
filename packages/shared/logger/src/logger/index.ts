/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

let loggerActive = true;

export const global = {
  setLoggerStatus: (active: boolean) => {
    loggerActive = active;
  },
};

const logMessage = <T>(
  type: 'warn' | 'log' | 'error',
  { message }: { message: string },
  object?: T,
) => {
  if (!loggerActive) {
    return;
  }

  if (object == null) {
    console[type](message);
  }

  console[type](message, object);
};

export const warn = <T>({ message }: { message: string }, object?: T) => {
  logMessage('warn', { message }, object);
};

export const log = <T>({ message }: { message: string }, object?: T) => {
  logMessage('log', { message }, object);
};

export const error = <T>({ message }: { message: string }, object?: T) => {
  logMessage('error', { message }, object);
};
