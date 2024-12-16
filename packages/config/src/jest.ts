import type { Config } from '@jest/types';
import { logger } from '@track-me-app/logger';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx|mts)?$': 'ts-jest',
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules', '.'],
};

export const jest = (
  overrides?: Config.InitialOptions,
): Config.InitialOptions => {
  logger.warn({ message: '-------- Running JEST with gpolit Config --------' });

  const mergedConfig = {
    ...config,
    ...overrides,
  };

  return mergedConfig;
};
