// TODO: lift into utils package

const format = ({ address }, name) =>
  `- ${name}: https://rinkeby.etherscan.io/address/${address}`

const print = (contract, name) => console.log(format(contract, name))

module.exports = { format, print }