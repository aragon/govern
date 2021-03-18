const jestConfig = require('./jest.config.js')
jestConfig.testMatch = ['/**/queryTest.e2e.ts', '/**/daoTest.e2e.ts']

module.exports = jestConfig;
