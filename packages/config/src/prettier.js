import { warn } from '@track-me-app/logger/src/logger/legacy.js';

const defaultPrettierConfig = {
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
};

export const prettier = () => {
  warn({ message: '-------- Running PRETTIER with gpolit Config --------' });
  return defaultPrettierConfig;
};
