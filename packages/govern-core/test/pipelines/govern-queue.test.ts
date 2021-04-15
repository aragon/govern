import { ethers, waffle} from 'hardhat'
import { expect } from 'chai'

import { GovernQueue } from '../../typechain/GovernQueue'
import { TestToken } from '../../typechain/TestToken'
import { ArbitratorMock } from '../../typechain/ArbitratorMock'
import { ERC3000ExecutorMock } from '../../typechain/ERC3000ExecutorMock'

import {
  GovernQueue__factory,
  TestToken__factory,
  ArbitratorMock__factory,
  ERC3000ExecutorMock__factory,
  ArbitratorWrongSubjectMock__factory,
} from '../../typechain'

import { container as containerJson } from './container'
import { getConfigHash, getContainerHash, getEncodedContainer } from './helpers'
import { formatBytes32String } from 'ethers/lib/utils'

// TODO: Create mock contract to check the return values of public methods
describe('Govern Queue', function() {
  let ownerAddr: string,
    testToken: TestToken,
    chainId: number,
    gq: GovernQueue,
    container: any

  const EVENTS = {
    SCHEDULED: 'Scheduled',
    LOCK: 'Locked',
    UNLOCK: 'Unlocked',
    EXECUTED: 'Executed',
    CHALLENGED: 'Challenged',
    EVIDENCE_SUBMITTED: 'EvidenceSubmitted',
    VETOED: 'Vetoed',
    CONFIGURED: 'Configured',
    RESOLVED: 'Resolved',
    RULED: 'Ruled'
  }

  const RULES = {
    APPROVED: 4,
    DENIED: 3
  }

  const ERRORS = {
    BAD_NONCE: 'queue: bad nonce',
    BAD_CONFIG: 'queue: bad config',
    BAD_DELAY: 'queue: bad delay',
    BAD_SUBMITTER: 'queue: bad submitter',
    CALLDATASIZE_LIMIT: 'calldatasize: limit exceeded',
    WAIT_MORE: 'queue: wait more',
    BAD_FEE_PULL: 'queue: bad fee pull',
    BAD_APPROVE: 'queue: bad approve',
    BAD_RESET: 'queue: bad reset',
    BAD_STATE: 'queue: bad state',
    BAD_DISPUTE_ID: 'queue: bad dispute id',
    BAD_SUBJECT: 'queue: not subject',
    UNRESOLVED: 'queue: unresolved',
    EVIDENCE: 'queue: evidence'
  }

  const STATE = {
    NONE: 0,
    SCHEDULED: 1,
    CHALLENGED: 2,
    APPROVED: 3,
    REJECTED: 4,
    CANCELLED: 5,
    EXECUTED: 6
  }

  container = JSON.parse(JSON.stringify(containerJson))

  const ownerTokenAmount = 1000000
  const disputeFee = 1000
  const disputeId = 1000
  const zeroByteHash = "0x0000000000000000000000000000000000000000"

  // grab the original, honest values that queue contract gets deployed with.
  const executionDelay  = container.config.executionDelay
  const maxCalldataSize = container.config.maxCalldataSize

  let executor: ERC3000ExecutorMock
  
  const createArbitratorMock = async () => {
    const ArbitratorMock = (await ethers.getContractFactory('ArbitratorMock')) as ArbitratorMock__factory
    const arbitratorMock = (await ArbitratorMock.deploy(testToken.address)) as ArbitratorMock
    return arbitratorMock;
  }


  beforeEach(async () => {
    container.payload.nonce = (await gq.nonce()).toNumber() + 1
  })


  before(async () => {
    chainId = (await ethers.provider.getNetwork()).chainId
    ownerAddr = await (await ethers.getSigners())[0].getAddress()
    container.payload.submitter = ownerAddr

    // add tokens for schedule, challenge and fee amounts from arbitrator
    const TestToken = (await ethers.getContractFactory('TestToken')) as TestToken__factory
    testToken = (await TestToken.deploy(ownerAddr)) as TestToken
    await testToken.mint(ownerAddr, 1000000)

    container.config.scheduleDeposit.token = testToken.address
    container.config.challengeDeposit.token = testToken.address

    // add ERC3000 executor
    const ERC3000ExecutorMock = (await ethers.getContractFactory('ERC3000ExecutorMock')) as ERC3000ExecutorMock__factory
    executor = await ERC3000ExecutorMock.deploy()
    container.payload.executor = executor.address


    const GQ = (await ethers.getContractFactory('GovernQueue')) as GovernQueue__factory

    gq = (await GQ.deploy(ownerAddr, container.config)) as GovernQueue

    await gq.bulk([
      {
        op: 0,
        role: gq.interface.getSighash(gq.interface.getFunction('schedule')),
        who: ownerAddr
      },
      {
        op: 0,
        role: gq.interface.getSighash(gq.interface.getFunction('execute')),
        who: ownerAddr
      },
      {
        op: 0,
        role: gq.interface.getSighash(gq.interface.getFunction('challenge')),
        who: ownerAddr
      },
      {
        op: 0,
        role: gq.interface.getSighash(gq.interface.getFunction('configure')),
        who: ownerAddr
      },
      {
        op: 0,
        role: gq.interface.getSighash(gq.interface.getFunction('veto')),
        who: ownerAddr
      }
    ])
  })

  context('GovernQueue.schedule', () => {

    before(async () => {
      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
    })
    
    it('emits the expected events and adds the container to the queue', async () => {
      await testToken.approve(gq.address, container.config.scheduleDeposit.amount)

      const containerHash = getContainerHash(container, gq.address, chainId)
      await expect(gq.schedule(container))
        .to.emit(gq, EVENTS.SCHEDULED)
      // .withArgs(containerHash, container.payload) // TODO also check container.payload

      expect(await gq.queue(containerHash)).to.equal(STATE.SCHEDULED)

      expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerTokenAmount - container.config.scheduleDeposit.amount)
    })


    it('reverts with "calldatasize: limit exceeded"', async () => {
      container.config.maxCalldataSize = 100
      
      await gq.configure(container.config);
     
      await expect(gq.schedule(container)).to.be.revertedWith(ERRORS.CALLDATASIZE_LIMIT)
      
      container.config.maxCalldataSize = maxCalldataSize
      await gq.configure(container.config);
      
    })
    

    it('reverts with "queue: bad config"', async () => {
      container.config.executionDelay = 100

      await expect(gq.schedule(container)).to.be.revertedWith(ERRORS.BAD_CONFIG)

      container.config.executionDelay = executionDelay
    })

    it('reverts with "queue: bad delay"', async () => {
      container.payload.executionTime = 0

      await expect(gq.schedule(container)).to.be.revertedWith(ERRORS.BAD_DELAY)

      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
    })

    it('reverts with "queue: bad submitter"', async () => {
      container.payload.submitter = zeroByteHash

      await expect(gq.schedule(container)).to.be.revertedWith(ERRORS.BAD_SUBMITTER)

      container.payload.submitter = ownerAddr
    })

    it('reverts with "queue: bad nonce"', async () => {
      container.payload.nonce = 0

      await expect(gq.schedule(container)).to.be.revertedWith(ERRORS.BAD_NONCE)
    })
  })

  context('GovernQueue.execute', async () => {

    before(async () => {
      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
    })

    it('emits the expected events and updates the container state', async () => {
      await testToken.approve(gq.address, container.config.scheduleDeposit.amount)
      await gq.schedule(container)

      await ethers.provider.send('evm_increaseTime', [executionDelay + 100])

      const ownerBalance = (await testToken.balanceOf(ownerAddr)).toNumber()
      const containerHash = getContainerHash(container, gq.address, chainId)

      await expect(gq.execute(container))
        .to.emit(gq, EVENTS.EXECUTED)
        .withArgs(containerHash, ownerAddr)

      expect(await gq.queue(containerHash)).to.equal(STATE.EXECUTED)

      expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance + container.config.scheduleDeposit.amount)

      expect(await executor.passedActionsLength()).to.equal(1)

      expect(await executor.passedAllowFailuresMap()).to.equal(container.payload.allowFailuresMap)

      expect(await executor.passedContainerHash()).to.equal(containerHash)
    })

    it('reverts with "queue: wait more"', async () => {
      await testToken.approve(gq.address, container.config.scheduleDeposit.amount)
      
      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100

      await gq.schedule(container)

      await expect(gq.execute(container)).to.be.revertedWith(ERRORS.WAIT_MORE)
    })

  })

  context('GovernQueue.challenge', () => {

    before(async () => {
      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
    })

    it('executes as expected', async () => {
      const ownerBalance = (await testToken.balanceOf(ownerAddr)).toNumber()

      const arbitratorMock = await createArbitratorMock();
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config)

      await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee)

      await gq.schedule(container)

      const containerHash = getContainerHash(container, gq.address, chainId)

      await expect(gq.challenge(container, formatBytes32String('NOPE!'))).to.emit(gq, EVENTS.CHALLENGED)

      expect(await gq.queue(containerHash)).to.equal(STATE.CHALLENGED)

      expect(await gq.challengerCache(containerHash)).to.equal(ownerAddr)

      expect(await gq.disputeItemCache(containerHash, container.config.resolver)).to.equal(disputeId + 1)
    
      expect(await testToken.balanceOf(ownerAddr)).to.equal(
        ownerBalance -(container.config.challengeDeposit.amount + container.config.challengeDeposit.amount + disputeFee)
      )

      expect(await arbitratorMock.possibleRulings()).to.equal(2)

      expect(await arbitratorMock.metadata()).to.equal(getEncodedContainer(container))

      expect(await arbitratorMock.evidencePeriodClosed()).to.equal(disputeId)
    })

    it('reverts with "queue: bad fee pull"', async () => {
      container.payload.proof = '0x01'
      
      await testToken.approve(gq.address, container.config.challengeDeposit.amount + container.config.scheduleDeposit.amount)

      const arbitratorMock = await createArbitratorMock();
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config)
      await gq.schedule(container)
  
      await expect(gq.challenge(container, formatBytes32String('NOPE!'))).to.be.revertedWith(ERRORS.BAD_FEE_PULL)
    })
    
    // TODO: Implement after mock contract solution has been found.
    it.skip('reverts with "queue: bad approve"', async () => {
      
    })

    // TODO: Implement after mock contract solution has been found.
    it.skip('reverts with "queue: bad reset"', async () => {
      
    })

  })


  context('GovernQueue.resolve', () => {

    before(async () => {
      container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
    })

    it('reverts with bad dispute id wrong dispute id is passed', async () => {
      const arbitratorMock = await createArbitratorMock();
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config);

      await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee);
      await gq.schedule(container)
      await gq.challenge(container,  "0x02");

      await expect(gq.resolve(container, 0)).to.be.revertedWith(ERRORS.BAD_DISPUTE_ID)
    })


    it('reverts when arbitrator subject does not match the queue address', async () => {
      const ArbitratorMock = (await ethers.getContractFactory('ArbitratorWrongSubjectMock')) as ArbitratorWrongSubjectMock__factory
      const arbitratorMock = await ArbitratorMock.deploy(testToken.address)
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config);

      await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee);
      await gq.schedule(container)
      await gq.challenge(container,  "0x02");

      await expect(gq.resolve(container, disputeId)).to.be.revertedWith(ERRORS.BAD_SUBJECT)
    })

    it('successfully rejects and cancels container when the ruling is not approved', async () => {
      const arbitratorMock = await createArbitratorMock();
      await arbitratorMock.executeRuling(disputeId, RULES.DENIED);
      
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config);

      await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee);

      let ownerBalance:any = (await testToken.balanceOf(ownerAddr))

      const containerHash = getContainerHash(container, gq.address, chainId)

      await gq.schedule(container);
      await gq.challenge(container,  "0x02");
      
      await expect(gq.resolve(container, disputeId))
            .to.emit(gq, EVENTS.RESOLVED)
            .withArgs(containerHash, ownerAddr, false)

      expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance - disputeFee)

      expect(await gq.challengerCache(containerHash)).to.equal(zeroByteHash)

      expect(await gq.queue(containerHash)).to.equal(STATE.CANCELLED)
    })



    it('successfully resolves and  approves container when the ruling is approved', async () => {
      const arbitratorMock = await createArbitratorMock();
      await arbitratorMock.executeRuling(disputeId, RULES.APPROVED);
      container.config.resolver = arbitratorMock.address;

      await gq.configure(container.config);

      await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee);

      const ownerBalance:any = (await testToken.balanceOf(ownerAddr))

      const containerHash = getContainerHash(container, gq.address, chainId)

      await gq.schedule(container);
      await gq.challenge(container,  "0x02");
      
      await expect(gq.resolve(container, disputeId))
            // .to.emit(gq, 'Unlocked') //TODO:GIORGI Unlock doesn't get emitted
            // .withArgs(container.config.scheduleDeposit.token, ownerAddr, container.config.scheduleDeposit.amount)
            .to.emit(gq, EVENTS.RESOLVED)
            .withArgs(containerHash, ownerAddr, true)
            .to.emit(gq, EVENTS.EXECUTED)
            .withArgs(containerHash, ownerAddr);

      expect(await gq.challengerCache(containerHash)).to.equal(zeroByteHash)

      expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance - disputeFee)

      expect(await gq.queue(containerHash)).to.equal(STATE.EXECUTED)
    })
    
  })
    
    context('GovernQueue.veto', () => {

      before(async () => {
        container.payload.executionTime = (await ethers.provider.getBlock('latest')).timestamp + executionDelay + 100
      })
      
      it('reverts when the container is not scheduled or challenged', async () => {
        await expect(gq.veto(container, "0x02")).to.be.revertedWith(ERRORS.BAD_STATE)
      })

      it('successfully cancels when the container is in scheduled state', async () => {
        const ownerBalance:any = (await testToken.balanceOf(ownerAddr))
        await testToken.approve(gq.address, container.config.scheduleDeposit.amount);

        await gq.schedule(container);

        expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance - container.config.scheduleDeposit.amount)

        const containerHash = getContainerHash(container, gq.address, chainId);
        
        await expect(gq.veto(container, "0x02"))
            // .to.emit(gq, EVENTS.UNLOCK) TODO:GIORGI
            // .withArgs(container.config.scheduleDeposit.token, ownerAddr, container.config.scheduleDeposit.amount)
               .to.emit(gq, EVENTS.VETOED)
               .withArgs(containerHash, ownerAddr, '0x02')

        expect(await gq.queue(containerHash)).to.be.equal(STATE.CANCELLED)

        expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance) 
      })

      it('successfully cancels when the container is in challenged state', async () => {
        const ownerBalance:any = (await testToken.balanceOf(ownerAddr))
        await testToken.approve(gq.address, container.config.scheduleDeposit.amount + container.config.challengeDeposit.amount + disputeFee);
        
        const ArbitratorMock = (await ethers.getContractFactory('ArbitratorMock')) as ArbitratorMock__factory
        const arbitratorMock = await ArbitratorMock.deploy(testToken.address)
        container.config.resolver = arbitratorMock.address;
        
        await gq.configure(container.config);

        await gq.schedule(container);
        await gq.challenge(container, '0x02');

        const containerHash = getContainerHash(container, gq.address, chainId);

        await expect(gq.veto(container, "0x02"))
            // .to.emit(gq, EVENTS.UNLOCK) TODO:GIORGI
            // .withArgs(container.config.scheduleDeposit.token, ownerAddr, container.config.scheduleDeposit.amount)
               .to.emit(gq, EVENTS.VETOED)
               .withArgs(containerHash, ownerAddr, '0x02')

        expect(await gq.queue(containerHash)).to.be.equal(STATE.CANCELLED)

        expect(await testToken.balanceOf(ownerAddr)).to.equal(ownerBalance-disputeFee)

        expect(await gq.challengerCache(containerHash)).to.equal(zeroByteHash)
        expect(await gq.disputeItemCache(containerHash, container.config.resolver)).to.equal(zeroByteHash)
      })
    })
    
    context('GovernQueue.configure', () => {
      it('updated the configuration as expected', async () => {

        const configHash = getConfigHash(container)
    
        await expect(gq.configure(container.config))
          .to.emit(gq, EVENTS.CONFIGURED)
          // .withArgs(
          //   configHash,
          //   ownerAddr,
          //   [
          //     container.config.executionDelay,
          //     [ container.config.scheduleDeposit.token, BigNumber.from(container.config.scheduleDeposit.amount) ],
          //     [ container.config.challengeDeposit.token, BigNumber.from(container.config.challengeDeposit.amount) ],
          //     container.config.resolver,
          //     container.config.rules,
          //   ]  //TODO:GIORGI
          // )
    
        // expect(await gq.configHash()).to.equal(configHash)
      })
    })
  })
