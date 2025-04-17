import { config } from 'dotenv';
import { logger } from '@track-me-app/logger';

const getEnvEntry = (key: string): string => {
  const path = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;
  // Re-read the environment file on each call
  config({
    path,
    override: true, // This ensures the values are overridden each time
  });

  logger.log({
    message: `Reading environment file ${path}`,
  });

  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  logger.log({
    message: `Returning environment variable ${key} is set to ${value} for env: ${process.env.NODE_ENV ? process.env.NODE_ENV : 'INVALID'}`,
  });
  return value;
};

export { getEnvEntry };
