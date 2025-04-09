import { config } from 'dotenv';
import { logger } from '@track-me-app/logger';

config({
  path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
});

const getEnvEntry = (key: string): string => {
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
