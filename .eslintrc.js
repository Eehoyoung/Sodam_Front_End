module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  rules: {
    // TypeScript 관련 규칙
    '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // React 관련 규칙
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-key': 'error',

    // React Native 관련 규칙
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',

    // 일반 규칙
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
  },
  env: {
    'react-native/react-native': true,
  },
};
