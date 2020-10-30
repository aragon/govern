const format = ({ address }, name) =>
  `- ${name}: https://${process.env.MAINNET ? '' : 'rinkeby.'}etherscan.io/address/${address}`

const print = (contract, name) => console.log(format(contract, name))

module.exports = { format, print }
