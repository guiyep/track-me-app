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
  error?: Error,
) => {
  if (!loggerActive) {
    return;
  }

  if (object == null) {
    console[type](message);
  }

  if (error != null) {
    console[type](message, error);
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
    { message: name ? `${name}|warn: ${message}` : message },
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
    { message: name ? `${name}|log: ${message}` : message },
    object,
  );
};

export const error = (
  { message }: { message: string },
  e?: unknown,
  name?: string,
) => {
  logMessage(
    'error',
    {
      message: name ? `${name}|error: ${message}` : message,
    },
    undefined,
    e as Error,
  );
};

export const asyncFunc = <T, K>(
  f: (...args: T[]) => Promise<K> | K,
  name?: string,
) => {
  return async (...args: T[]) => {
    log(
      {
        message: `${name ?? f.name}|async_start`,
      },
      { ...args },
    );
    try {
      const result = await f(...args);
      log({ message: `${name ?? f.name}|async_end:` }, { result });
      return result;
    } catch (e) {
      error({ message: `${name ?? f.name}|async_error:` }, e as Error);
      throw e;
    }
  };
};

export const syncFunc = <T, K>(f: (...args: T[]) => K, name?: string) => {
  return (...args: T[]) => {
    log({ message: `${name ?? f.name}|sync_start:` }, args);
    try {
      const result = f(...args);
      log({ message: `${name ?? f.name}|sync_end:` }, { result });
      return result;
    } catch (e) {
      error({ message: `${name ?? f.name}|sync_error:` }, e as Error);
      throw e;
    }
  };
};

export const decorate = ({
  name,
  folder,
}: {
  name: string;
  folder?: string;
}) => {
  const fullName = folder ? `//${folder}.${name}` : name;
  return {
    decorate: ({
      name: newName,
      folder: newFolderName,
    }: {
      name: string;
      folder?: string;
    }) => decorate({ name: fullName + '.' + newName, folder: newFolderName }),
    asyncFunc: <T, K>(f: (...args: T[]) => Promise<K> | K) =>
      asyncFunc(f, fullName),
    syncFunc: <T, K>(f: (...args: T[]) => K) => syncFunc(f, fullName),
    warn: <T>({ message }: { message: string }, object?: T) => {
      warn({ message }, object, fullName);
    },
    log: <T>({ message }: { message: string }, object?: T) => {
      log({ message }, object, fullName);
    },
    error: ({ message }: { message: string }, e?: Error) => {
      error({ message }, e, fullName);
    },
  };
};
