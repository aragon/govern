import { ethers, network, waffle } from 'hardhat'
import { expect } from 'chai'
import * as registryAbi from './registryAbi.json'
import { createDao, CreateDaoParams, DaoConfig } from '../../public/createDao'
import {
    Proposal,
    ProposalParams,
    PayloadType
} from '../../public/proposal'


// use rinkeby addresses as the tests run on a hardhat network forked from rinkeby
const tokenAddress = '0x9fB402A33761b88D5DcbA55439e6668Ec8D4F2E8'
const registryAddress = '0x7714e0a2A2DA090C2bbba9199A54B903bB83A73d'
const daoFactoryAddress = '0xb75290e69f83b52bfbf9c99b4ae211935e75a851'
const resolver = '0xC464EB732A1D2f5BbD705727576065C91B2E9f18'
const emptyBytes = '0x'

const noCollateral = {
  token: ethers.constants.AddressZero,
  amount: 0
}

const goodConfig: DaoConfig = {
  executionDelay: 1, // how many seconds to wait before being able to call `execute`.
  scheduleDeposit: noCollateral,
  challengeDeposit: noCollateral,
  resolver,
  rules: emptyBytes,
  maxCalldataSize: 100000, // initial maxCalldatasize
}

type payloadArgs = {
  submitter: string
  executor: string
  nonce: number
}

const buildPayload = ({submitter, executor, nonce}: payloadArgs) => {
  const payload: PayloadType = {
    nonce,
    executionTime: Math.floor(Date.now() / 1000) + 50,
    submitter,
    executor,
    actions: [ {to: tokenAddress, value: 0, data: emptyBytes}],
    allowFailuresMap: ethers.utils.hexZeroPad('0x0', 32),
    proof: emptyBytes
  }
  
  return payload;
}


describe("Proposal", function() {
  let queueAddress: string
  let executor: string
  let proposal: Proposal
  let proposalData: ProposalParams
  let proposalResult: any
  let nonce: number = 0

  before(async () => {
    // create dao  
    const token = {
      tokenName: 'unicorn',
      tokenSymbol: 'MAG',
      tokenDecimals: 6,
    }

    const params: CreateDaoParams = {
      name: 'unicorn',
      token,
      config: goodConfig,
      useProxies: false,
    }

    const options = { provider: network.provider, daoFactoryAddress }
    const result = await createDao(params, options)

    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

    // get executor and queue address from register event
    const registryContract = new ethers.Contract(
      registryAddress,
      registryAbi,
      ethers.provider
    )

    const args = receipt.logs
      .filter(({ address }) => address === registryContract.address)
      .map((log: any) => registryContract.interface.parseLog(log))
      .find(({ name }: { name: string }) => name === 'Registered')

    executor = args?.args[0] as string
    queueAddress = args?.args[1] as string

  })

  beforeEach(async function(){
    proposal = new Proposal(queueAddress, { provider: network.provider })

    const signers = await ethers.getSigners()
    
    nonce++
    const payload = buildPayload({submitter: signers[0].address, executor, nonce})
    proposalData = {
      payload,
      config: goodConfig
    }

    proposalResult = await proposal.schedule(proposalData)
  })

  it("schedule should work", async function() {
    const receipt = await proposalResult.wait()
    expect(receipt.status).to.equal(1)
    expect(proposalResult.hash).to.equal(receipt.transactionHash)

  });

  it.skip("veto should work", async function() {
    const reason = 'veto reason'
    const result = await proposal.veto(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

  it.skip("challenge should work", async function() {
    const reason = 'challenge reason'
    const result = await proposal.challenge(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

  it.skip("resolve should work", async function() {
    const reason = 'challenge reason'
    const tx = await proposal.challenge(proposalData, reason)
    await tx.wait()

    const disputeId = 0
    const result = await proposal.resolve(proposalData, disputeId)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

  it("execute should work", async function() {
    // mine a block so we can execute the proposal
    await ethers.provider.send('evm_increaseTime', [600])

    const result = await proposal.execute(proposalData)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

})

