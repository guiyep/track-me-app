export const generalRules = {
  rules: {
    'eol-last': ['error', 'always'],
    'no-plusplus': 'off',
    'no-use-before-define': 'off',
    'prefer-destructuring': 'off',
    'no-console': 'error',
  },
};

export const tsRules = {
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports', // Always use 'import type'
      },
    ],
    '@typescript-eslint/no-unnecessary-type-parameters': 'off',
  },
};

export const importRules = {
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
