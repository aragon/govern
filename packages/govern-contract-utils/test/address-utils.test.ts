import { expect } from 'chai'
import { ethers } from 'hardhat'
import { AddressUtilsMock, AddressUtilsMock__factory } from '../typechain'

describe('AddressUtils', function () {
  let addressUtils: AddressUtilsMock
  let owner: any

  beforeEach(async () => {
    const AddressUtilsMock = (await ethers.getContractFactory(
      'AddressUtilsMock'
    )) as AddressUtilsMock__factory
    addressUtils = await AddressUtilsMock.deploy()
    owner = await (await ethers.getSigners())[0].getAddress()
  })

  it('returns false if the address is not the contract', async () => {
    expect(await addressUtils.isContract(owner)).to.equal(false)
  })

  it('returns true if the address is the contract', async () => {
    expect(await addressUtils.isContract(addressUtils.address)).to.equal(true)
  })

  it('returns the same address that was passed', async () => {
    expect(await addressUtils.toPayable(owner)).to.equal(owner)
  })
})
