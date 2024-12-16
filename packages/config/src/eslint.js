import eslintPkg from '@eslint/js';
import { config, configs } from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import { generalRules, importRules, tsRules } from './overrides.js';
import { warn } from '@track-me-app/logger/src/logger/legacy.js';

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
