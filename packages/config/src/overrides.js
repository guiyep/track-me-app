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
  },
};

export const importRules = {
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
