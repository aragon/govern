const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/packages/*/jest.config.js'],
  coverageDirectory: '<rootDir>/coverage/',
  testTimeout: 120000,
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.{ts,tsx}'],
}
