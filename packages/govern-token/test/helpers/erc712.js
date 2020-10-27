const abi = require('web3-eth-abi')
const { keccak256 } = require('web3-utils')

function createDomainSeparator(name, version, chainId, verifyingContract) {
  return keccak256(
    abi.encodeParameters(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
        keccak256(name),
        keccak256(version),
        chainId,
        verifyingContract
      ]
    )
  )
}

module.exports = {
  createDomainSeparator,
}
