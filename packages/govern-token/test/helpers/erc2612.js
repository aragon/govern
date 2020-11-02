const abi = require('web3-eth-abi')
const { keccak256, soliditySha3 } = require('web3-utils')

const PERMIT_TYPEHASH = keccak256('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)')

async function createPermitDigest(token, owner, spender, value, nonce, deadline) {
  const domainSeparator = await token.getDomainSeparator()

  // Tightly pack with soliditySha3
  return soliditySha3(
    { type: 'bytes1', value: '0x19' },
    { type: 'bytes1', value: '0x01' },
    { type: 'bytes32', value: domainSeparator },
    { type: 'bytes32', value:
        keccak256(
          abi.encodeParameters(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            [PERMIT_TYPEHASH, owner, spender, value, nonce, deadline]
          )
        )
    }
  )
}

module.exports = {
  createPermitDigest,
  PERMIT_TYPEHASH
}
