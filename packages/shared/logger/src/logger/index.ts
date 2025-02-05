/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/ban-ts-comment */

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

  console[type](
    message,
    typeof object === 'object' ? JSON.stringify(object) : object,
  );
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

export const func = <T, K>(f: (...args: T[]) => Promise<K> | K) => {
  return async (...args: T[]) => {
    log(
      { message: `Logging Function: "${f.name}" start execution` },
      { ...args },
    );
    try {
      const result = await f(...args);
      log(
        { message: `Logging Function: "${f.name}" has completed` },
        { result, args },
      );
      return result;
    } catch (e) {
      error({ message: `Logging Function: "${f.name}" Failed` }, { e, args });
      throw e;
    }
  };
};

const funcWithName = <T, K>(
  name: string,
  f: (...args: T[]) => Promise<K> | K,
) => {
  return async (...args: T[]) => {
    log(
      { message: `Logging Function: "${name}.${f.name}" start execution` },
      { args },
    );
    try {
      const result = await f(...args);
      log(
        { message: `Logging Function: "${name}.${f.name}" has completed` },
        { result, args },
      );
      return result;
    } catch (e) {
      error(
        { message: `Logging Function: "${name}.${f.name}" Failed` },
        { e, args },
      );
      throw e;
    }
  };
};

export const pkg = (name: string, obj: Record<string, unknown>) => {
  return Object.entries(obj).reduce<Record<string, unknown>>(
    (acc, [fName, fLogic]) => {
      // @ts-ignore
      acc[fName] = funcWithName(name, fLogic);
      return acc;
    },
    {},
  );
};
