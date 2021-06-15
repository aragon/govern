import { ethers, network } from 'hardhat'
import { expect } from 'chai'
import { createDao, CreateDaoParams, DaoConfig } from '../../public/createDao'
import { registryAbi } from './createDaoTest.hd'
import {
  Proposal,
  ProposalParams,
  PayloadType,
  ProposalOptions,
  ActionType,
} from '../../public'

import { Container, ReceiptType } from '../../public/proposal'
import { TestToken, ArbitratorMock } from '@aragon/govern-core/typechain'

import * as TestTokenArtifact from '@aragon/govern-core/artifacts/contracts/test/TestToken.sol/TestToken.json'
import * as ArbitratorMockArtifact from '@aragon/govern-core/artifacts/contracts/test/ArbitratorMock.sol/ArbitratorMock.json'
import { TransactionReceipt } from '@ethersproject/abstract-provider'

const RULES = {
  APPROVED: 4,
  DENIED: 3,
}

const vetoAbi = [
  'function bulk((uint8 op, bytes4 role, address who)[] items)',
  `function veto(${Container} _container, bytes _reason)`,
]

// use rinkeby addresses as the tests run on a hardhat network forked from rinkeby
const tokenAddress = '0x9fB402A33761b88D5DcbA55439e6668Ec8D4F2E8'
const registryAddress = '0x93731ce6db7f1ab978c722f3bcda494d12dcc0a1' //'0x7714e0a2A2DA090C2bbba9199A54B903bB83A73d'
const daoFactoryAddress = '0x91209b1352E1aD3abF7C7b74A899F3b118287f9D' //'0x53B7C20e6e4617FC5f8E1d113F0abFb2FCE1D5E2'
const emptyBytes = '0x'

const noCollateral = {
  token: ethers.constants.AddressZero,
  amount: 0,
}

type payloadArgs = {
  submitter: string
  executor: string
  executionTime: number
  actions?: ActionType[]
}

// advance the time in blockchain so we can run test faster
async function advanceTime(provider: any) {
  const currentTimestamp = (await provider.getBlock('latest')).timestamp
  await provider.send('evm_increaseTime', [currentTimestamp + 100])
}

function encodeDataForVetoRole(who: string): string {
  const iface = new ethers.utils.Interface(vetoAbi)
  const role = iface.getSighash('veto')
  const paramData = iface.encodeFunctionData('bulk', [[{ op: 0, role, who }]])
  return paramData
}

const buildPayload = ({
  submitter,
  executor,
  actions,
  executionTime,
}: payloadArgs) => {
  const payload: PayloadType = {
    executionTime,
    submitter,
    executor,
    actions: actions ?? [{ to: tokenAddress, value: 0, data: emptyBytes }],
    allowFailuresMap: ethers.utils.hexZeroPad('0x0', 32),
    proof: emptyBytes,
  }

  return payload
}

type ProposalResult = {
  proposal: Proposal
  proposalData: ProposalParams
  txResult: any
}

type makeProposalParams = {
  options: ProposalOptions
  queueAddress: string
  executor: string
  actions?: ActionType[]
}

describe('Proposal', function () {
  let queueAddress: string
  let executor: string
  let testToken: TestToken
  let signer = new ethers.providers.Web3Provider(
    <any>network.provider
  ).getSigner()
  let arbitrator: ArbitratorMock
  const daoConfig: DaoConfig = {
    executionDelay: 1, // how many seconds to wait before being able to call `execute`.
    scheduleDeposit: noCollateral,
    challengeDeposit: noCollateral,
    resolver: '',
    rules: emptyBytes,
    maxCalldataSize: 100000, // initial maxCalldatasize
  }

  const createArbitratorMock = async (testTokenAddress: string) => {
    const { abi, bytecode } = ArbitratorMockArtifact
    const ArbitratorMock = new ethers.ContractFactory(abi, bytecode, signer)
    const arbitratorMock = (await ArbitratorMock.deploy(
      testTokenAddress
    )) as ArbitratorMock
    return arbitratorMock
  }

  const createTestToken = async () => {
    const { abi, bytecode } = TestTokenArtifact
    const signerAddress = await signer.getAddress()
    const TestToken = new ethers.ContractFactory(abi, bytecode, signer)
    const testToken = (await TestToken.deploy(signerAddress)) as TestToken
    await testToken.mint(signerAddress, 1000000)
    return testToken
  }

  async function makeProposal(
    args: makeProposalParams
  ): Promise<ProposalResult> {
    const { options, queueAddress, executor, actions } = args
    const proposal = new Proposal(queueAddress, options)
    const web3Provider = new ethers.providers.Web3Provider(options.provider)
    const submitter = await web3Provider.getSigner().getAddress()

    const currentTimestamp = (await web3Provider.getBlock('latest')).timestamp
    const executionTime =
      Number(currentTimestamp) + Number(daoConfig.executionDelay) + 100
    const payload = buildPayload({
      submitter,
      executor,
      actions,
      executionTime,
    })
    const proposalData = { payload, config: daoConfig }
    const txResult = await proposal.schedule(proposalData)

    return { proposal, proposalData, txResult }
  }

  async function grantVetoPower(
    provider: any,
    queueAddress: string,
    executor: string
  ) {
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    const testUser = await signer.getAddress()

    const changeVetoRole = encodeDataForVetoRole(testUser)
    const actions: ActionType[] = [
      { to: queueAddress, value: 0, data: changeVetoRole },
    ]

    const {
      proposal: vetoProposal,
      txResult: vetoProposalTx,
      proposalData: vetoData,
    } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
      actions,
    })
    await vetoProposalTx.wait()

    // advance the time so we can execute the proposal immediately
    await advanceTime(ethers.provider)

    const vetoResult = await vetoProposal.execute(vetoData)
    const execResult = await vetoResult.wait()

    expect(execResult.status).to.equal(1)
    expect(vetoResult.hash).to.equal(execResult.transactionHash)
  }

  before(async () => {
    // create dao
    testToken = await createTestToken()
    arbitrator = await createArbitratorMock(testToken.address)
    daoConfig.resolver = arbitrator.address

    const [owner, addr1, addr2] = await ethers.getSigners()
    const accessList = [owner.address, addr1.address, addr2.address]

    const token = {
      tokenName: 'unicorn',
      tokenSymbol: 'MAG',
      tokenDecimals: 6,
      mintAddress: owner.address,
      mintAmount: 100,
      merkleRoot: '0x' + '00'.repeat(32),
      merkleMintAmount: 0,
    }

    const params: CreateDaoParams = {
      name: 'unicorn',
      token,
      config: daoConfig,
      scheduleAccessList: accessList,
      useProxies: false,
    }

    const options = { provider: network.provider, daoFactoryAddress }
    const result = await createDao(params, options)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

    // get executor and queue address from register event
    const iface = new ethers.utils.Interface(registryAbi)
    const args = receipt.logs
      .filter(({ address }) => address === registryAddress)
      .map((log: any) => iface.parseLog(log))
      .find(({ name }: { name: string }) => name === 'Registered')

    executor = args?.args[0] as string
    queueAddress = args?.args[1] as string
  })

  it('schedule should work', async function () {
    const { txResult } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
    })

    const receipt = await txResult.wait()
    expect(receipt.status).to.equal(1)
    expect(txResult.hash).to.equal(receipt.transactionHash)
    const containerHash = Proposal.getContainerHashFromReceipt(
      receipt,
      ReceiptType.Scheduled
    )
    expect(containerHash).to.be.a('string').with.length.greaterThan(0)
  })

  it('veto should work', async function () {
    // remember the snapshot to move back after this test is finished.
    const snapshotId = await ethers.provider.send('evm_snapshot', [])
    // submit a proposal to give the test user veto power
    await grantVetoPower(network.provider, queueAddress, executor)

    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
    })
    await txResult.wait()

    const reason = 'veto reason'
    const result = await proposal.veto(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
    const containerHash = Proposal.getContainerHashFromReceipt(
      receipt,
      ReceiptType.Vetoed
    )
    expect(containerHash).to.be.a('string').with.length.greaterThan(0)

    // gets back to the snapshot before time was advanced.
    // necessary so that other tests can still work with court
    // without getting CLK_TOO_MANY_TRANSITIONS error.
    await ethers.provider.send('evm_revert', [snapshotId])
  })

  it('challenge should work', async function () {
    const { feeAmount } = await arbitrator.getDisputeFees()
    let tx = await testToken.approve(queueAddress, feeAmount)
    await tx.wait()

    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
    })
    await txResult.wait()

    const reason = ethers.utils.toUtf8Bytes('challenge reason')
    const result = await proposal.challenge(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
    const containerHash = Proposal.getContainerHashFromReceipt(
      receipt,
      ReceiptType.Challenged
    )
    expect(containerHash).to.be.a('string').with.length.greaterThan(0)
  })

  it('resolve should work', async function () {
    const { feeAmount } = await arbitrator.getDisputeFees()
    let tx = await testToken.approve(queueAddress, feeAmount)
    await tx.wait()

    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
    })
    await txResult.wait()

    const reason = ethers.utils.toUtf8Bytes('challenge reason')
    tx = await proposal.challenge(proposalData, reason)
    const challengeReceipt = await tx.wait()

    // can only dispute after a challenge
    const disputeId = proposal.getDisputeId(
      <TransactionReceipt>challengeReceipt
    )
    expect(disputeId).to.not.be.null

    await arbitrator.executeRuling(disputeId!, RULES.APPROVED)
    const result = await proposal.resolve(proposalData, disputeId!)

    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
    const containerHash = Proposal.getContainerHashFromReceipt(
      receipt,
      ReceiptType.Resolved
    )
    expect(containerHash).to.be.a('string').with.length.greaterThan(0)
  })

  it('execute should work', async function () {
    const { proposal, proposalData, txResult } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor,
    })
    await txResult.wait()

    // advance the time so we can execute the proposal immediately
    await advanceTime(ethers.provider)
    const result = await proposal.execute(proposalData)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
    const containerHash = Proposal.getContainerHashFromReceipt(
      receipt,
      ReceiptType.Executed
    )
    expect(containerHash).to.be.a('string').with.length.greaterThan(0)
  })

  it('use invalid queue abi should throw', async function () {
    const abi = [
      `function schedule(bool) public`,
      `function nonce() public view returns (uint256)`,
    ]

    try {
      const provider = network.provider
      const tx = await makeProposal({
        options: { provider, abi },
        queueAddress,
        executor,
      })
      expect(tx).to.be.undefined
    } catch (err) {
      expect(err.message).to.eq('Transaction reverted without a reason')
    }
  })
})
