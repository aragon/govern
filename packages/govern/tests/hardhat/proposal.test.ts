import { ethers, network, waffle } from 'hardhat'
import { expect } from 'chai'
import * as registryAbi from './registryAbi.json'
import { createDao } from '../../public/createDao'
import {
    Proposal,
    ProposalParams,
    PayloadType,
    CollateralType,
    ConfigType
 } from '../../public/proposal'


// use rinkeby addresses as the tests run on a hardhat network forked from rinkeby
const tokenAddress = '0x9fB402A33761b88D5DcbA55439e6668Ec8D4F2E8'
const registryAddress = '0x8Adf949ADBAB3614f5340b21d9D9AD928d218096'
const emptyBytes = '0x'

const noCollateral: CollateralType = {
  token: ethers.constants.AddressZero,
  amount: 0
}

const DUMMY_CONFIG =
{
  executionDelay: 0,
  scheduleDeposit: noCollateral,
  challengeDeposit: noCollateral,
  vetoDeposit: noCollateral,
  resolver: ethers.constants.AddressZero,
  rules: emptyBytes
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


describe.only("Proposal", function() {
  let queueAddress: string
  let executor: string
  let proposal: Proposal
  let proposalData: ProposalParams
  let proposalResult: any
  let nonce: number = 0

  before(async () => {
    // create dao  
    const result = await createDao({
      name: 'unicorn',
      token: {
        name: 'magical',
        symbol: 'MAG'
      },
      useProxies: false
    },
    {
      provider: network.provider
    })

    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

    // get executor and queue address from register event
    const registryContract = new ethers.Contract(registryAddress, registryAbi, ethers.provider)
    
    const contractLogs = receipt.logs
    .filter(({ address }: { address: string }) => address === registryContract.address)

    const registerArgs = contractLogs
    .map((log: any) => registryContract.interface.parseLog(log))
    .find(({ name }: { name: string }) => name === 'Registered')

    executor = registerArgs?.args[0] as string
    queueAddress = registerArgs?.args[1] as string

  })

  beforeEach(async function(){
    proposal = new Proposal(queueAddress, { provider: network.provider })

    const signers = await ethers.getSigners()
    
    nonce++
    const payload = buildPayload({submitter: signers[0].address, executor, nonce})
    proposalData = {
      payload,
      config: DUMMY_CONFIG
    }

    proposalResult = await proposal.schedule(proposalData)
    console.log('nonce', nonce)
  })

  it("schedule should work", async function() {
    const receipt = await proposalResult.wait()
    expect(receipt.status).to.equal(1)
    expect(proposalResult.hash).to.equal(receipt.transactionHash)

  });

  it("veto should work", async function() {
    const reason = 'veto reason'
    const result = await proposal.veto(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

  it("challenge should work", async function() {
    const reason = 'challenge reason'
    const result = await proposal.challenge(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });

  it("resolve should work", async function() {
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

