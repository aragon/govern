module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'react-app',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['prettier', 'react', 'react-hooks', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
