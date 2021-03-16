const { formatBytes32String } = require('ethers/lib/utils')
const { expect } = require('chai');

const EVENTS = {
    MINTED_SINGLE: 'MintedSingle',
}

const ERRORS = {
    ACL_AUTH: 'acl: auth'
}

describe('GovernTokenFactory', function () {
    let signers, 
        owner, 
        governExecutor, 
        mintAddr,
        governTokenFactory

    before(async () => {
        signers = await ethers.getSigners()
        owner = await signers[0].getAddress();
        governExecutor = await signers[1].getAddress();
        mintAddr = await signers[2].getAddress();

        const GovernTokenFactory = await ethers.getContractFactory('GovernTokenFactory')
        governTokenFactory = await GovernTokenFactory.deploy();
    })

    async function getTokenAndMinter(tx) {
        const { events } = await tx.wait()
        const { token, minter } = events.find(({ event }) => event === 'CreatedToken').args
        return {
            token: (await ethers.getContractAt('GovernToken', token)),
            minter: (await ethers.getContractAt('GovernMinter', minter))
        }
    }

    let options = [
        {
            title: "Deploys token and minter with proxies",
            params: {
                useProxies: true
            }
        },
        {
            title: "Deploys token and minter without proxies",
            params: {
                useProxies: false
            }
        }
    ];

    options.forEach(item => {
        describe(item.title, async () => {
            let token, minter, tx
            let mintedAmount = 100

            before(async () => {
                tx = await governTokenFactory.newToken(
                    governExecutor, 
                    "TokenName", 
                    "TokenSymbol", 
                    18,
                    mintAddr, 
                    mintedAmount, 
                    item.useProxies
                );
                const data = await getTokenAndMinter(tx);
                token = data.token;
                minter = data.minter;
            })

            it("checks if amount is minted and minter is the correct minter", async () => {
                expect(await token.balanceOf(mintAddr)).to.equal(mintedAmount);
                expect(await token.minter()).to.equal(minter.address);
                await expect(tx)
                    .to.emit(minter, EVENTS.MINTED_SINGLE)
                    // initial mint is 12 length, in bytes, it's 24 and plus 0x (overal 26)
                    .withArgs(mintAddr, mintedAmount, formatBytes32String("initial mint").slice(0, 26))
            })

            it("reverts if the mint is not called from GovernExecutor", async () => {
                let tx = minter.mint(mintAddr, mintedAmount, "0x");
                await expect(tx).to.be.revertedWith(ERRORS.ACL_AUTH);
            })

            it("reverts if root role function is not called from GovernExecutor", async () => {
                let tx = minter.grant(minter.interface.getSighash('mint'), owner)
                await expect(tx).to.be.revertedWith(ERRORS.ACL_AUTH);
            })

            it("succeeds if mint is called from the GovernExecutor", async () => {
                minter = minter.connect(signers[1]); // governExecutor
                let tx = minter.mint(mintAddr, mintedAmount, "0x");
                await expect(tx)
                    .to.emit(minter, EVENTS.MINTED_SINGLE)
                    .withArgs(mintAddr, mintedAmount, "0x")
            })

            it("succeeds if root role function is called from GovernExecutor", async () => {
                minter = minter.connect(signers[1]); // governExecutor
                let mintSelector = minter.interface.getSighash('mint');
                await minter.grant(mintSelector, owner);
                expect(await minter.roles(mintSelector, owner)).not.equal(`0x${'0'.repeat(40)}`)
            })
        })
    })
})
