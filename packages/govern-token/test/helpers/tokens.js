const { bigExp, bn } = require('@aragon/contract-helpers-test')

function tokenAmount(amount) {
  return bigExp(amount, 18)
}

module.exports = {
  tokenAmount,
}
