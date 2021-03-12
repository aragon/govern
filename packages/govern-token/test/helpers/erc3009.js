const { keccak256, defaultAbiCoder, toUtf8Bytes, solidityKeccak256 } = require('ethers/lib/utils')

const TRANSFER_WITH_AUTHORIZATION_TYPEHASH = keccak256(toUtf8Bytes('TransferWithAuthorization(address from,address to,uint256 value,uint256 validAfter,uint256 validBefore,bytes32 nonce)'))

async function createTransferWithAuthorizationDigest(token, from, to, value, validAfter, validBefore, nonce) {
  const domainSeparator = await token.getDomainSeparator()

  return solidityKeccak256(
    ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
    [
      '0x19', 
      '0x01', 
      domainSeparator, 
      keccak256(
        defaultAbiCoder.encode(
          ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256', 'bytes32'],
          [TRANSFER_WITH_AUTHORIZATION_TYPEHASH, from, to, value, validAfter, validBefore, nonce]
        )
      )
    ]
  );

}

module.exports = {
  createTransferWithAuthorizationDigest,
  TRANSFER_WITH_AUTHORIZATION_TYPEHASH
}
