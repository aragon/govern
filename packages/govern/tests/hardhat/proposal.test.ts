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
const resolver = tokenAddress
const emptyBytes = '0x00'

const noCollateral: CollateralType = {
  token: ethers.constants.AddressZero,
  amount: 0
}


const buildPayload = ({submitter, executor}: { submitter: string, executor: string}) => {
  const payload: PayloadType = {
    nonce: 1,
    executionTime: Math.floor(Date.now() / 1000),
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
  let config: ConfigType

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
    
    config =
    {
      executionDelay: 0,
      scheduleDeposit: noCollateral,
      challengeDeposit: noCollateral,
      vetoDeposit: noCollateral,
      resolver: ethers.constants.AddressZero,
      rules: ethers.utils.hexZeroPad('0x0', 32)
    }
    
  })

  it.only("Should schedule a proposal successfully", async function() {
    const proposal = new Proposal(queueAddress, { provider: network.provider })

    const signers = await ethers.getSigners()
    
    const payload = buildPayload({submitter: signers[0].address, executor})
    const data: ProposalParams = {
      payload,
      config
    }

    console.log('data', data)
    const result = await proposal.schedule(data)
    const receipt = await result.wait()
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

  });

})

