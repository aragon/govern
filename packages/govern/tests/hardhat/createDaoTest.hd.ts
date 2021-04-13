import { ethers, network } from 'hardhat'
import { expect } from 'chai'
import { createDao, CreateDaoParams, CreateDaoOptions } from '../../public/create-dao'

const registryAddress = '0x8Adf949ADBAB3614f5340b21d9D9AD928d218096'
import * as registryAbi from './registry-abi.json' 

describe("Create Dao", function() {
  it.only("Should create a dao successfully using default factory", async function() {
    const params: CreateDaoParams = {
      name: 'magic',
      token: {
        name: 'magical',
        symbol: 'MAG'
      },
      useProxies: false
    }

    const provider = network.provider
    const options: CreateDaoOptions = {
      provider
    }

    const result = await createDao(params, options)
    const receipt = await result.wait()
    expect(result).to.have.property('hash');
    expect(receipt).to.have.property('transactionHash')
    expect(receipt.status).to.equal(1)
    expect(result.hash).to.equal(receipt.transactionHash)

    // make sure register event is emitted
    const registryContract = new ethers.Contract(registryAddress, registryAbi, ethers.provider)
    
    const args = receipt.logs
    .filter(({ address }: { address: string }) => address === registryContract.address)
    .map((log: any) => registryContract.interface.parseLog(log))
    .find(({ name }: { name: string }) => name === 'Registered')

    const queueAddress = args?.args[1] as string
    const governAddress = args?.args[0] as string

    expect(ethers.utils.isAddress(queueAddress)).to.equal(true)
    expect(ethers.utils.isAddress(governAddress)).to.equal(true)

    // make sure the name is used
    const used = await registryContract.nameUsed(params.name)
    expect(used).to.equal(true)
  });
});

