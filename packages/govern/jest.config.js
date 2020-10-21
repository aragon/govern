const config = {
  // notifyMode: 'success-change',
  collectCoverage: true,
  coverageDirectory: './coverage/',
  coverageThreshold: {
    global: {
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  // notify: true,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  testMatch: ['/**/**Test.ts'],
  bail: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
  ],
  preset: 'ts-jest'
};