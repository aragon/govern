// Use a custom babel configuration with CRA
const { useBabelRc, override } = require('customize-cra')

module.exports = override(useBabelRc())
