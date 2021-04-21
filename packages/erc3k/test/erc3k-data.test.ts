import { ethers } from 'hardhat'
import { expect } from 'chai'
import { keccak256, defaultAbiCoder, solidityPack } from 'ethers/lib/utils'
import { ERC3000DataLibTest, ERC3000DataLibTest__factory } from '../typechain'
import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'


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

function getPayloadHash(): string {
  return keccak256(
    defaultAbiCoder.encode(
      [
        'tuple(' +
        'uint256 nonce, ' +
        'uint256 executionTime, ' +
        'address submitter, ' +
        'address executor, ' +
        'bytes32 actionHash, ' +
        'bytes32 allowFailuresMap, ' +
        'bytes32 proofBytes' +
        ')',
      ],
      [
        {
          nonce: container.payload.nonce,
          executionTime: container.payload.executionTime,
          submitter: container.payload.submitter,
          executor: container.payload.executor,
          actionHash: keccak256(
            defaultAbiCoder.encode(
              [
                'tuple(' +
                'address to, ' +
                'uint256 value, ' +
                'bytes data' +
                ')[]',
              ],
              [container.payload.actions]
            )
          ),
          allowFailuresMap: container.payload.allowFailuresMap,
          proofBytes: keccak256(container.payload.proof),
        }
      ]
    )
  )
}

function getConfigHash(): string {
  return keccak256(
    defaultAbiCoder.encode(
      [
        'tuple(' +
        'uint256 executionDelay, ' +
        'tuple(address token, uint256 amount) scheduleDeposit, ' +
        'tuple(address token, uint256 amount) challengeDeposit, ' +
        'address resolver, ' +
        'bytes rules,' +
        'uint256 maxCalldataSize' +
        ')',
      ],
      [container.config]
    )
  )
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
      getConfigHash()
    )
  })

  it('calls testPayloadHash and returns the expected hash', async () => {
    expect(await erc3kDataLib.testPayloadHash(container.payload)).to.be.equal(
      getPayloadHash()
    )
  })

  it('calls testContainerHash and returns the expected hash [ @skip-on-coverage ]', async () => {
    expect(await erc3kDataLib.testContainerHash(container)).to.be.equal(
      keccak256(
        solidityPack(
          ['string', 'address', 'uint', 'bytes32', 'bytes32'],
          [
            'erc3k-v1',
            erc3kDataLib.address,
            chainId,
            getPayloadHash(),
            getConfigHash(),
          ]
        )
      )
    )
  })
})
