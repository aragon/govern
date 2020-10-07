module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['prettier', 'jest'],
  rules: {
    'import/no-unresolved': 'error',
    'promise/no-nesting': ['off'],
    'linebreak-style': ['error', 'unix'],
    curly: 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: { jest: true },
    },
  ],
}
