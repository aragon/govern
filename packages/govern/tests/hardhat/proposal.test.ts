import { ethers, network } from 'hardhat'
import { expect } from 'chai'
import { createDao, CreateDaoParams, DaoConfig } from '../../public/createDao'
import { registryAbi } from './createDaoTest.hd'
import {
    Proposal,
    ProposalParams,
    PayloadType,
    ProposalOptions
} from '../../public/proposal'

const tokenAbi = ["function generateTokens(address to, uint256 amount)", "function approve(address to, uint256 amount)"]
const disputeAbi = ["function getDisputeFees() external view returns (address recipient, address feeToken, uint256 feeAmount)"]

// use rinkeby addresses as the tests run on a hardhat network forked from rinkeby
const tokenAddress = '0x9fB402A33761b88D5DcbA55439e6668Ec8D4F2E8'
const registryAddress = '0x7714e0a2A2DA090C2bbba9199A54B903bB83A73d'
const daoFactoryAddress = '0xb75290e69f83b52bfbf9c99b4ae211935e75a851'
const resolver = '0xC464EB732A1D2f5BbD705727576065C91B2E9f18'
const emptyBytes = '0x'

const noCollateral = {
  token: ethers.constants.AddressZero,
  amount: 0,
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
}

async function generateDisputeTokenAndApprove(recipient: any, court: string, queue: string) {
  const signer = (new ethers.providers.Web3Provider(recipient)).getSigner()
  const recipientAddress = await signer.getAddress()
  
  // get the dispute fee and send approval
  const contract = new ethers.Contract(court, disputeAbi, signer)
  const [_, feeToken, feeAmount] = await contract.getDisputeFees()

  const token = new ethers.Contract(feeToken, tokenAbi, signer)
  let tx = await token.generateTokens(recipientAddress, feeAmount)
  await tx.wait()

  tx = await token.approve(queue, feeAmount)
  await tx.wait()

}

const buildPayload = ({submitter, executor}: payloadArgs) => {
  const payload: PayloadType = {
    executionTime: Math.floor(Date.now() / 1000) + 50,
    submitter,
    executor,
    actions: [{ to: tokenAddress, value: 0, data: emptyBytes }],
    allowFailuresMap: ethers.utils.hexZeroPad('0x0', 32),
    proof: emptyBytes,
  }

  return payload
}

type ProposalResult = {
  proposal: Proposal,
  proposalData: ProposalParams,
  txResult: any
}

type makeProposalParams = {
  options: ProposalOptions,
  queueAddress: string,
  executor: string  
}

async function makeProposal(args: makeProposalParams): Promise<ProposalResult>
{
  const { options, queueAddress, executor} = args
  const proposal = new Proposal(queueAddress, options)
  const web3Provider = new ethers.providers.Web3Provider(options.provider)
  const submitter = await (web3Provider.getSigner()).getAddress()

  const payload = buildPayload({ submitter, executor })
  const proposalData = { payload, config: goodConfig }
  const txResult = await proposal.schedule(proposalData)

  return { proposal, proposalData, txResult }
}

describe("Proposal", function() {
  let queueAddress: string
  let executor: string

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
    const iface = new ethers.utils.Interface(registryAbi)

    const args = receipt.logs
      .filter(({ address }) => address === registryAddress)
      .map((log: any) => iface.parseLog(log))
      .find(({ name }: { name: string }) => name === 'Registered')

    executor = args?.args[0] as string
    queueAddress = args?.args[1] as string
  })

  it("schedule should work", async function() {
    const { txResult } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor
    })

    const receipt = await txResult.wait()
    expect(receipt.status).to.equal(1)
    expect(txResult.hash).to.equal(receipt.transactionHash)
  
  });

  it.skip("veto should work", async function() {
    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor
    })
    await txResult.wait()

    const reason = 'veto reason'
    const result = await proposal.veto(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  })

  it.skip("challenge should work", async function() {

    await generateDisputeTokenAndApprove(network.provider, resolver, queueAddress)

    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor
    })
    await txResult.wait()

    const reason = 'challenge reason'
    const result = await proposal.challenge(proposalData, reason)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

  })

  it.skip("resolve should work", async function() {
    await generateDisputeTokenAndApprove(network.provider, resolver, queueAddress)

    const { proposal, txResult, proposalData } = await makeProposal({
      options: { provider: network.provider },
      queueAddress,
      executor
    })
    await txResult.wait()

    const reason = 'challenge reason'
    const tx = await proposal.challenge(proposalData, reason)
    const challengeReceipt = await tx.wait()

    // can only dispute after a challenge
    const disputeId = proposal.getDisputeId(challengeReceipt)
    expect(disputeId).to.not.be.null

    const result = await proposal.resolve(proposalData, disputeId!)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  })

  it("execute should work", async function() {
    const { proposal, proposalData, txResult } = await makeProposal({
      options: { provider: network.provider},
      queueAddress,
      executor
    })
    await txResult.wait()

    // advance the time so we can execute the proposal
    await ethers.provider.send('evm_increaseTime', [600])

    const result = await proposal.execute(proposalData)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)
  });


  it("use invalid queue abi should throw", async function() {
    const abi = [
      `function schedule(bool) public`,
      `function nonce() public view returns (uint256)`
    ]

    try {
      const provider = network.provider
      const tx = await makeProposal({
        options: { provider, abi },
        queueAddress,
        executor
      })
      expect(tx).to.be.undefined

    } catch (err) {

      expect(err.message).to.eq('Transaction reverted without a reason')
    }

  })
})
