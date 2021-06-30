import { ethers } from 'hardhat'
import { expect } from 'chai'
import { keccak256, defaultAbiCoder, solidityPack } from 'ethers/lib/utils'
import { ERC3000DataLibTest, ERC3000DataLibTest__factory } from '../typechain'
import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'
import { getConfigHash, getPayloadHash } from '../utils/ERC3000'

let container = {
  config: ERC3000DefaultConfig,
  payload: {
    nonce: 1,
    executionTime: 1000,
    submitter: '0xb794f5ea0ba39494ce839613fffba74279579268',
    executor: '0xb794f5ea0ba39494ce839613fffba74279579268',
    actions: [
      {
        to: '0xb794f5ea0ba39494ce839613fffba74279579268',
        value: 1000,
        data: '0x00',
      },
    ],
    allowFailuresMap:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    proof: '0x00',
  },
}

describe('ERC3000Data', function () {
  let erc3kDataLib: ERC3000DataLibTest
  let chainId: number

  beforeEach(async () => {
    const ERC3000DataLibTest = (await ethers.getContractFactory(
      'ERC3000DataLibTest'
    )) as ERC3000DataLibTest__factory

    erc3kDataLib = await ERC3000DataLibTest.deploy()
    chainId = (await ethers.provider.getNetwork()).chainId
  })

  it('calls testConfigHash and returns the expected hash', async () => {
    expect(await erc3kDataLib.testConfigHash(container.config)).to.be.equal(
      getConfigHash(container.config)
    )
  })

  it('calls testPayloadHash and returns the expected hash', async () => {
    expect(await erc3kDataLib.testPayloadHash(container.payload)).to.be.equal(
      getPayloadHash(container)
    )
  })

  it('calls testContainerHash and returns the expected hash', async () => {
    expect(await erc3kDataLib.testContainerHash(container)).to.be.equal(
      keccak256(
        solidityPack(
          ['string', 'address', 'uint', 'bytes32', 'bytes32'],
          [
            'erc3k-v1',
            erc3kDataLib.address,
            chainId,
            getPayloadHash(container),
            getConfigHash(container.config),
          ]
        )
      )
    )
  })
})
