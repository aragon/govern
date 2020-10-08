module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/coverage/',
  testTimeout: 120000,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
}
