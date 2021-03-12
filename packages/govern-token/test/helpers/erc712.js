const { keccak256, defaultAbiCoder, toUtf8Bytes} = require('ethers/lib/utils')

function createDomainSeparator(name, version, chainId, verifyingContract) {

  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes(version)),
        chainId,
        verifyingContract
      ]
    )
  )
}

module.exports = {
  createDomainSeparator,
}
