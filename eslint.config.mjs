import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

const rulesConfigOverrides = {
  rules: {
    'eol-last': ['error', 'always'],
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
  },
};

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        window: true,
        module: true,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}', '*.{js,jsx,cjs,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  rulesConfigOverrides,
);
