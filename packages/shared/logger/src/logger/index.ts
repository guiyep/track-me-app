/* eslint-disable no-console */

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

export const warn = <T>(
  { message }: { message: string },
  object?: T,
  name?: string,
) => {
  logMessage(
    `warn`,
    { message: name ? `Warn: ${name} - ${message}` : message },
    object,
  );
};

export const log = <T>(
  { message }: { message: string },
  object?: T,
  name?: string,
) => {
  logMessage(
    'log',
    { message: name ? `Log: ${name} - ${message}` : message },
    object,
  );
};

export const error = <T>(
  { message }: { message: string },
  object?: T,
  name?: string,
) => {
  logMessage(
    'error',
    {
      message: name ? `ErrorLog: ${name} - ${message}` : message,
    },
    object,
  );
};

export const asyncFunc = <T, K>(
  f: (...args: T[]) => Promise<K> | K,
  name?: string,
) => {
  return async (...args: T[]) => {
    log(
      {
        message: `Async Function: "${name ?? f.name}" start execution`,
      },
      { ...args },
    );
    try {
      const result = await f(...args);
      log(
        {
          message: `Async Function: "${name ?? f.name}" has completed`,
        },
        { result, args },
      );
      return result;
    } catch (e) {
      console.error(`Async Function: "${name ?? f.name}"`, e);
      throw e;
    }
  };
};

export const syncFunc = <T, K>(f: (...args: T[]) => K, name?: string) => {
  return (...args: T[]) => {
    log(
      { message: `Sync Function: "${name ?? f.name}" start execution` },
      { ...args },
    );
    try {
      const result = f(...args);
      log(
        { message: `Sync Function: "${name ?? f.name}" has completed` },
        { result, args },
      );
      return result;
    } catch (e) {
      error(
        { message: `Sync Function: "${name ?? f.name}" Failed` },
        { e, args },
      );
      throw e;
    }
  };
};

export const withLogger = (name: string) => {
  return {
    asyncFunc: <T, K>(f: (...args: T[]) => Promise<K> | K) =>
      asyncFunc(f, name),
    syncFunc: <T, K>(f: (...args: T[]) => K) => syncFunc(f, name),
    warn: <T>(message: string, object?: T) => {
      warn({ message }, object, name);
    },
    log: <T>(message: string, object?: T) => {
      log({ message }, object, name);
    },
    error: <T>(message: string, object?: T) => {
      error({ message }, object, name);
    },
  };
};
