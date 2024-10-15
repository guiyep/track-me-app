import eslintPkg from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
// import importPlugin from 'eslint-plugin-import';
import { generalRules } from './overrides/general-rules.mjs';

const defaultEslintCoreConfig = tseslint.config(
  eslintPkg.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // importPlugin.flatConfigs.recommended,
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
    extends: [tseslint.configs.disableTypeChecked],
  },
  generalRules,
);

export const eslint = () => {
  return defaultEslintCoreConfig;
};
