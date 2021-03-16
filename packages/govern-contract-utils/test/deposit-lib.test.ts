import { expect } from 'chai'
import { ethers } from 'hardhat'
import { defaultAbiCoder } from 'ethers/lib/utils'

import {
    DepositLibMock, DepositLibMock__factory,
    GoodToken, GoodToken__factory
} from '../typechain'


const balanceAmount = 10000

const ERRORS = {
    BAD_TOKEN_LOCK: "deposit: bad token lock"
}


describe('DepositLib', function () {
    let depositLibMock: DepositLibMock
    let goodToken: GoodToken
    let owner: any;

    beforeEach(async () => {
        const DepositLibMockFactory = (await ethers.getContractFactory('DepositLibMock')) as DepositLibMock__factory
        depositLibMock = await DepositLibMockFactory.deploy()

        const GoodTokenFactory = (await ethers.getContractFactory('GoodToken')) as GoodToken__factory
        goodToken = await GoodTokenFactory.deploy();

        owner = await (await ethers.getSigners())[0].getAddress()
    })

    it("reverts if the token in the collateral is not a contract", async () => {
        const deposit = {
            token: owner,
            amount: 1000,
        }
        await expect(depositLibMock.collectFrom(deposit, owner)).to.be.revertedWith(ERRORS.BAD_TOKEN_LOCK)
    })


    it("reverts if the token's `from` address doesn't have approval for `to` address", async () => {
        const deposit = {
            token: goodToken.address,
            amount: 1000,
        }

        await expect(depositLibMock.collectFrom(deposit, owner)).to.be.revertedWith(ERRORS.BAD_TOKEN_LOCK)
    })

    it("successfully makes the transfer and emits the ", async () => {

        const deposit = {
            token: goodToken.address,
            amount: 1000,
        }
        
        await goodToken.setBalanceTo(owner, 1000);

        let tx =await depositLibMock.collectFrom(deposit, owner);
        await expect(tx)
            .to.emit(goodToken, 'Transfer')
            .withArgs(owner, depositLibMock.address, 1000)


    })




  
})
