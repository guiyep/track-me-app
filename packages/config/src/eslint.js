import eslintPkg from '@eslint/js';
import { config, configs } from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { generalRules, importRules, tsRules } from './overrides.js';
import { warn } from '@track-me-app/logger/src/logger/legacy.js';
import pluginJest from 'eslint-plugin-jest';

const defaultEslintCoreConfig = config(
  eslintPkg.configs.recommended,
  ...configs.strictTypeChecked,
  ...configs.stylisticTypeChecked,
  importPlugin?.flatConfigs?.recommended || {},
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        window: true,
        module: true,
      },
      parserOptions: {
        projectService: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}', '*.{js,jsx,cjs,mjs}'],
    extends: [configs.disableTypeChecked],
  },
  {
    files: ['**/*.test.ts', '*.test.ts'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        beforeAll: true,
        afterAll: true,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  {
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  generalRules,
  importRules,
  tsRules,
);

export const eslint = (overrides = []) => {
  warn({ message: '-------- Running ESLINT with gpolit Config --------' });
  return [...defaultEslintCoreConfig, ...(overrides || [])];
};
