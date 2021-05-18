const {
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityKeccak256,
} = require('ethers/lib/utils')

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes(
    'Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'
  )
)

async function createPermitDigest(
  token,
  owner,
  spender,
  value,
  nonce,
  deadline
) {
  const domainSeparator = await token.getDomainSeparator()

  return solidityKeccak256(
    ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
    [
      '0x19',
      '0x01',
      domainSeparator,
      keccak256(
        defaultAbiCoder.encode(
          ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
          [PERMIT_TYPEHASH, owner, spender, value, nonce, deadline]
        )
      ),
    ]
  )
}

module.exports = {
  createPermitDigest,
  PERMIT_TYPEHASH,
}
