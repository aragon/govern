import { ethers } from '@nomiclabs/buidler'
import { expect } from 'chai'
import { Erc3000DataLibTest, Erc3000DataLibTestFactory } from '../typechain'
import { solidityPack, keccak256 } from 'ethers/lib/utils'

let deposit = {
    token: '0xb794f5ea0ba39494ce839613fffba74279579268',
    amount: 1000
  },
  container = {
    config: {
      executionDelay: 1000,
      scheduleDeposit: deposit,
      challengeDeposit: deposit,
      vetoDeposit: deposit,
      resolver: '0xb794f5ea0ba39494ce839613fffba74279579268',
      rules: '0x00'
    },
    payload: {
      nonce: 1,
      executionTime: 1000,
      submitter: '0xb794f5ea0ba39494ce839613fffba74279579268',
      executor: '0xb794f5ea0ba39494ce839613fffba74279579268',
      actions: [{
        to: '0xb794f5ea0ba39494ce839613fffba74279579268',
        value: 1000,
        data: '0x00'
      }],
      allowFailuresMap: '0x0000000000000000000000000000000000000000000000000000000000000000',
      proof: '0x00'
    }
  }

function getPayloadHash(): string {
  return solidityPack(
    [],
    [
      container.payload.nonce,
      container.payload.executionTime,
      container.payload.submitter,
      container.payload.executor,
      solidityPack([], container.payload.actions),
      container.payload.allowFailuresMap,
      keccak256(container.payload.proof)
    ]
  )

}

function getConfigHash(): string {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint256', '', '', '', 'address'], [container.config]))
}

describe('ERC3000Data', function() {
  let erc3kDataLib: Erc3000DataLibTest

  beforeEach(async () => {
    const ERC3000DataLibTest = (await ethers.getContractFactory(
      'ERC3000DataLibTest'
    )) as Erc3000DataLibTestFactory

    erc3kDataLib = await ERC3000DataLibTest.deploy()
  })

  it('calls testConfigHash and returns the expected hash', async () => {
    expect(await erc3kDataLib.testConfigHash(container.config))
      .to.be.equal(getConfigHash())
  })

  it('calls testPayloadHash and returns the expected hash', async () => {
    await expect(erc3kDataLib.testPayloadHash(container.payload))
      .to.be.equal(getPayloadHash())
  })

  it('calls testContainerHash and returns the expected hash', async () => {
    await expect(erc3kDataLib.testContainerHash(container))
      .to.be.equal(solidityPack(
        ['string', 'address', 'bytes32', 'bytes32'],
        ['erc3k-v1', erc3kDataLib.address, getPayloadHash(), getConfigHash()]
      ))
  })
})
