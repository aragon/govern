import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import {
  CloneFactoryMock__factory,
  CloneFactoryMock,
  ClonedContract,
  ClonedContractWithInit,
} from '../typechain'

describe('ERC1167ProxyFactory', () => {
  let signers: Signer[],
    owner: string,
    factory: CloneFactoryMock,
    clonedContractAddress: string,
    clonedContract: any

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
    const CloneFactoryMock = (await ethers.getContractFactory(
      'CloneFactoryMock'
    )) as unknown as CloneFactoryMock__factory
    factory = await CloneFactoryMock.deploy()
  })

  context('Clone', () => {
    it('clone without constructor parameters', async () => {
      await factory.clone()

      clonedContractAddress = await factory.latestClonedContract()
      clonedContract = (await ethers.getContractAt(
        'ClonedContract',
        clonedContractAddress,
        signers[0]
      )) as unknown as ClonedContract

      expect(await clonedContract.getRandomString()).to.be.equal('NO INIT')
    })

    it('clone with constructor parameters', async () => {
      await factory.cloneWithInitData()

      clonedContractAddress = await factory.latestClonedContract()
      clonedContract = (await ethers.getContractAt(
        'ClonedContractWithInit',
        clonedContractAddress,
        signers[0]
      )) as unknown as ClonedContractWithInit

      expect(await clonedContract.randomString()).to.be.equal('INIT DATA')
    })
  })

  context('Clone with create2', () => {
    it('clone without constructor parameters', async () => {
      await factory.clone2()

      clonedContractAddress = await factory.latestClonedContract()
      clonedContract = (await ethers.getContractAt(
        'ClonedContract',
        clonedContractAddress,
        signers[0]
      )) as unknown as ClonedContract

      expect(await clonedContract.getRandomString()).to.be.equal('NO INIT')
    })

    it('clone with constructor parameters', async () => {
      await factory.clone2WithInitData()

      clonedContractAddress = await factory.latestClonedContract()
      clonedContract = (await ethers.getContractAt(
        'ClonedContractWithInit',
        clonedContractAddress,
        signers[0]
      )) as unknown as ClonedContractWithInit

      expect(await clonedContract.randomString()).to.be.equal('INIT DATA')
    })
  })

  context('Helper methods', () => {
    it('calls "generateCreateData" as expected', async () => {
      const cloningContract = (await factory.cloningContract())
        .substring(2)
        .toLowerCase()
      await factory.generateCreateData()

      expect(await factory.generatedCreateData()).to.equal(
        `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${cloningContract}5af43d82803e903d91602b57fd5bf3`
      )
    })

    it('calls "_getRevertMsg" with a revert message', async () => {
      await factory.getRevertMessage(
        '0x08c379a0' +
          defaultAbiCoder.encode(['string'], ['Revert Message']).substr(2)
      )

      expect(await factory.revertMessage()).to.equal('Revert Message')
    })

    it('calls "_getRevertMsg" without a revert message', async () => {
      await factory.getRevertMessage('0x08c379a0')

      expect(await factory.revertMessage()).to.equal('')
    })
  })
})
