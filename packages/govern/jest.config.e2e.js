const jestConfig = require('./jest.config.js')
jestConfig.testMatch = ['/**/**Test.e2e.ts']

module.exports = jestConfig
