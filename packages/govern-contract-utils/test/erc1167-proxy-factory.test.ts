import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer } from 'ethers'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { generateCodeFromContract } from './helpers'
import {
  CloneFactoryMockFactory,
  CloneFactoryMock
} from '../typechain'
import {
  ClonedContractAbi
} from '../artifacts/contracts/test/ClonedContract.sol/ClonedContract.json'
import {
  ClonedContractWithInitAbi
} from '../artifacts/contracts/test/ClonedContractWithInit.sol/ClonedContractWithInit.json'


describe('ERC1167ProxyFactory', () => {
  let signers: Signer[],
      owner: string,
      factory: CloneFactoryMock,
      clonedContractAddress: string,
      clonedContract: any;

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
    const CloneFactoryMock = (await ethers.getContractFactory('CloneFactoryMock')) as CloneFactoryMockFactory
    factory = await CloneFactoryMock.deploy()
  })

  context('Clone', () => {
    it('clone without constructor parameters', async () => {
      await factory.clone()

      clonedContractAddress = await factory.latestClonedContract();
      clonedContract = ethers.getContractAt(
        clonedContractAddress,
        ClonedContractAbi,
        signers[0]
      )

      expect(await clonedContract.randomString())
        .to.be.equal('NO INIT')
    })

    it('clone with constructor parameters', async () => {
      await factory.cloneWithInitData()

      clonedContractAddress = await factory.latestClonedContract();
      clonedContract = ethers.getContractAt(
        clonedContractAddress,
        ClonedContractWithInitAbi,
        signers[0]
      )

      expect(await clonedContract.randomString())
        .to.be.equal('INIT DATA')
    })
  })

  context('Clone with create2', () => {
    it('clone without constructor parameters', async () => {
      await factory.clone2()

      clonedContractAddress = await factory.latestClonedContract();
      clonedContract = ethers.getContractAt(
        clonedContractAddress,
        ClonedContractAbi,
        signers[0]
      )

      expect(await clonedContract.randomString())
        .to.be.equal('NO INIT')
    })

    it('clone with constructor parameters', async () => {
      await factory.clone2WithInitData()

      clonedContractAddress = await factory.latestClonedContract();
      clonedContract = ethers.getContractAt(
        clonedContractAddress,
        ClonedContractWithInitAbi,
        signers[0]
      )

      expect(await clonedContract.randomString())
        .to.be.equal('INIT DATA')
    })
  })

  context('Helper methods', () => {
    it('calls "generateCode" as expected', async () => {
      await factory.generateCode()

      expect(await factory.generatedCode())
        .to.equal(generateCodeFromContract(ClonedContractAbi))
    })

    it('calls "_getRevertMsg" with a revert message', async () => {
      await factory.getRevertMessage('0x08c379a0')

      expect(await factory.revertMessage()).to.equal('');
    })

    it('calls "_getRevertMsg" without a revert message', async () => {
      await factory.getRevertMessage(
        '0x08c379a0' +
        defaultAbiCoder.encode(
          ['string'],
          ['Revert Message']
        )
      )

      expect(await factory.revertMessage()).to.equal('Revert Message');
    })
  })
})
