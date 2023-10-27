import { ethers } from 'hardhat'
import { expect } from 'chai'
import { keccak256, solidityPack } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

import { ERC3000DefaultConfig } from 'erc3k/utils/ERC3000'

import {
  GovernRegistryMock__factory,
  GovernRegistryMock,
  GovernQueueFactoryMock__factory,
  GovernQueueFactoryMock,
  GovernFactoryMock__factory,
  GovernFactoryMock,
  GovernTokenFactoryMock__factory,
  GovernTokenFactoryMock,
  GovernBaseFactory,
  GovernBaseFactory__factory,
} from '../typechain'

const zeroAddress = ethers.constants.AddressZero
const customAddress = '0x'+'11'.repeat(20)

describe('Govern Base Factory with mocked contracts', function () {
  let GovernFactoryMock: GovernFactoryMock
  let GovernQueueFactoryMock: GovernQueueFactoryMock
  let GovernTokenFactoryMock: GovernTokenFactoryMock
  let GovernRegistryMock: GovernRegistryMock
  let GovernBaseFactory: GovernBaseFactory
  let owner: any

  before(async () => {
    // Deploy Mocks
    GovernQueueFactoryMock = await ((await ethers.getContractFactory(
      'GovernQueueFactoryMock'
    )) as unknown as GovernQueueFactoryMock__factory).deploy()

    GovernTokenFactoryMock = await ((await ethers.getContractFactory(
      'GovernTokenFactoryMock'
    )) as unknown as GovernTokenFactoryMock__factory).deploy()

    GovernFactoryMock = await ((await ethers.getContractFactory(
      'GovernFactoryMock'
    )) as unknown as GovernFactoryMock__factory).deploy()

    GovernRegistryMock = await ((await ethers.getContractFactory(
      'GovernRegistryMock'
    )) as unknown as GovernRegistryMock__factory).deploy()

    // Deploy the GovernBaseFactory
    GovernBaseFactory = await ((await ethers.getContractFactory(
      'GovernBaseFactory'
    )) as unknown as GovernBaseFactory__factory).deploy(
      GovernRegistryMock.address,
      GovernFactoryMock.address,
      GovernQueueFactoryMock.address,
      GovernTokenFactoryMock.address
    )

    owner = await (await ethers.getSigners())[0].getAddress()
  })

  async function deployDAO(
    deployToken: boolean,
    useProxies: boolean,
    name: string
  ) {
    const createSalt = (name: string, useProxies: boolean) => {
      return useProxies
        ? keccak256(solidityPack(['string'], [name]))
        : '0x' + '0'.repeat(64)
    }

    const mintAmount = 100

    const token = {
      tokenAddress: deployToken ? zeroAddress : customAddress,
      tokenName: 'Eagle Token',
      tokenSymbol: 'EAG',
      tokenDecimals: 18,
      mintAddress: owner,
      mintAmount: mintAmount,
      merkleRoot: '0x'+'00'.repeat(32),
      merkleMintAmount:0,
      merkleTree: '0x',
      merkleContext: '0x'
    };
    
    const tx = await GovernBaseFactory.newGovern(
      token,
      [],
      useProxies,
      ERC3000DefaultConfig,
      name,
    )
    
    await expect(tx)
      .to.emit(GovernQueueFactoryMock, 'NewQueueCalledWith')
      .withArgs(GovernBaseFactory.address, createSalt(name, useProxies)) // TODO: add config check too after the fix about struct emitting is done.
      .to.emit(GovernFactoryMock, 'NewGovernCalledWith')
      .withArgs(GovernQueueFactoryMock.address, createSalt(name, useProxies))

    if (deployToken) {
      await expect(tx)
        .to.emit(GovernTokenFactoryMock, 'NewTokenCalledWith')
        .withArgs(
          GovernFactoryMock.address,
          'Eagle Token',
          'EAG',
          18,
          owner,
          mintAmount,
          useProxies
        )
    }

    await expect(tx)
      .to.emit(GovernRegistryMock, 'registerCalledWith')
      .withArgs(
        GovernFactoryMock.address,
        GovernQueueFactoryMock.address,
        deployToken ? GovernTokenFactoryMock.address : customAddress,
        deployToken ? GovernTokenFactoryMock.address : zeroAddress,
        name,
        '0x'
      )

    // TODO: GovernQueueFactory emits the struct with 6 members with the BulkCalled event. Add it after the fix has been found
    // here to add.
  }

  it('Deploys DAO with new token and proxies', async () => {
    await deployDAO(true, true, 'Eagle')
  })

  it('Deploys DAO with new token, but without proxies', async () => {
    await deployDAO(true, false, 'Eagle')
  })

  it('Deploys DAO with custom token and proxies', async () => {
    await deployDAO(false, true, 'Eagle')
  })

  it('Deploys DAO with custom token, but without proxies', async () => {
    await deployDAO(false, false, 'Eagle')
  })
})
