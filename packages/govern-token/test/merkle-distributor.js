const { assertBn, assertEvent, assertRevert } = require('@aragon/contract-helpers-test/src/asserts')
const { BigNumber } = require('ethers')

const BalanceTree = require('./helpers/merkle-tree/balance-tree').default;

const TestERC20 = artifacts.require('TestERC20')
const Distributor = artifacts.require('MerkleDistributor')

const ZERO_BYTES32 = `0x${`0`.repeat(64)}`

contract('MerkleDistributor', (wallets) => {

    let wallet0 = wallets[0];
    let wallet1 = wallets[1];

    beforeEach('deploy token', async () => {
        token = await TestERC20.new('Aragon Network Token', 'ANT', 0, { from : wallet0 })
    })
    
    describe('#token', () => {
        it('returns the token address', async () => {
            const distributor = await Distributor.new(token.address, ZERO_BYTES32, { from : wallet0 })
            expect(await distributor.token()).to.eq(token.address)
        })
    })

    describe('#merkleRoot', () => {
        it('returns the zero merkle root', async () => {
            const distributor = await Distributor.new(token.address, ZERO_BYTES32, { from : wallet0 })
            expect(await distributor.merkleRoot()).to.eq(ZERO_BYTES32)
        })
    })

    describe('two account tree', () => {
        let distributor, tree

        beforeEach('deploy', async () => {
            tree = new BalanceTree([
                { account: wallet0, amount: BigNumber.from(100) },
                { account: wallet1, amount: BigNumber.from(101) },
            ])

            distributor = await Distributor.new(token.address, tree.getHexRoot(), { from : wallet0 })
            await token.setBalance(distributor.address, 201)
        })
  
        it('successful claim', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            const receipt1 = await distributor.claim(0, wallet0, 100, proof0)
            assertEvent(receipt1, 'Claimed', { expectedArgs:  { index:0, to:wallet0, amount: 100 } })

            const proof1 = tree.getProof(1, wallet1, BigNumber.from(101))
            const receipt2 = await distributor.claim(1, wallet1, 101, proof1)
            assertEvent(receipt2, 'Claimed', { expectedArgs:  { index:1, to:wallet1, amount: 101 } })
        })

        it('transfers the token', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            assertBn(await token.balanceOf(wallet0), 0)

            await distributor.claim(0, wallet0, 100, proof0)
            assertBn(await token.balanceOf(wallet0), 100)
        })

        it('should not fail and should not transfer', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            await token.setBalance(distributor.address, 99)
            await distributor.claim(0, wallet0, 100, proof0)
            assertBn(await token.balanceOf(distributor.address), 99)
            assertBn(await token.balanceOf(wallet0), 0)
        })

        it('sets #isClaimed', async () => {
            expect(await distributor.isClaimed(0)).to.eq(false)
            expect(await distributor.isClaimed(1)).to.eq(false)

            const proof = tree.getProof(0, wallet0, BigNumber.from(100))
            await distributor.claim(0, wallet0, 100, proof)
            expect(await distributor.isClaimed(0)).to.eq(true)
            expect(await distributor.isClaimed(1)).to.eq(false)
        })

        it('returns unclaimed balance', async () => {
            const proof = tree.getProof(0, wallet0, BigNumber.from(100))
            assertBn(await distributor.unclaimedBalance(0, wallet0, 100, proof), 100);
        })

        it('returns 0 when it is claimed', async () => {
            const proof = tree.getProof(0, wallet0, BigNumber.from(100))
            await distributor.claim(0, wallet0, 100, proof)
            assertBn(await distributor.unclaimedBalance(0, wallet0, 100, proof), 0);
        })

        it('returns 0 for invalid proof', async () => {
            assertBn(await distributor.unclaimedBalance(0, wallet0, 100, [ZERO_BYTES32]), 0);
        })

        
        it('cannot allow two claims', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            await distributor.claim(0, wallet0, 100, proof0)
            await assertRevert(distributor.claim(0, wallet0, 100, proof0), 'dist: already claimed')
        })

        it('cannot claim more than once: 0 and then 1', async () => {
            const proof1 = tree.getProof(0, wallet0, BigNumber.from(100))
            await distributor.claim(0, wallet0, 100, proof1)
            const proof2 = tree.getProof(1, wallet1, BigNumber.from(101))
            await distributor.claim(1, wallet1, 101, proof2)
            
            await assertRevert(
                distributor.claim(
                    0, 
                    wallet0, 
                    100, 
                    tree.getProof(0, wallet0, BigNumber.from(100))
                ), 
                'dist: already claimed'
            )
        })

        it('cannot claim more than once: 1 and then 0', async () => {
            const proof1 = tree.getProof(1, wallet1, BigNumber.from(101))
            await distributor.claim(1, wallet1, 101, proof1)
            const proof2 = tree.getProof(0, wallet0, BigNumber.from(100))
            await distributor.claim(0, wallet0, 100, proof2)
            

            await assertRevert(
                distributor.claim(
                    1, 
                    wallet1, 
                    101, 
                    tree.getProof(1, wallet1, BigNumber.from(101))
                ), 
                'dist: already claimed'
            )
        })

        it('cannot claim for address other than proof', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            await assertRevert(distributor.claim(1, wallet1, 101, proof0), 'dist: proof failed')
        })

        it('cannot claim more than proof', async () => {
            const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
            await assertRevert(distributor.claim(0, wallet0, 101, proof0), 'dist: proof failed')
        })

    })

    describe('larger tree', async () => {

        let distributor, tree
        
        beforeEach('deploy', async () => {
            tree = new BalanceTree(
                wallets.map((wallet, ix) => {
                  return { account: wallet, amount: BigNumber.from(ix + 1) }
                })
            )

            distributor = await Distributor.new(token.address, tree.getHexRoot(), { from : wallet0 })
            await token.setBalance(distributor.address, 201)
        })
  
        it('claim index 4', async () => {
          const proof = tree.getProof(4, wallets[4], BigNumber.from(5))
          const receipt = await distributor.claim(4, wallets[4], 5, proof)
          assertEvent(receipt, 'Claimed', { expectedArgs:  { index:4, to:wallets[4], amount: 5 } })
        })
  
        it('claim index 9', async () => {
            const proof = tree.getProof(9, wallets[9], BigNumber.from(10))
            const receipt = await distributor.claim(9, wallets[9], 10, proof)
            assertEvent(receipt, 'Claimed', { expectedArgs:  { index:9, to:wallets[9], amount: 10 } })
        })
  
    })

})
