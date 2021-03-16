// const { BigNumber } = require('ethers')

// const BalanceTree = require('./helpers/merkle-tree/balance-tree').default;
// const  { expect } =require('chai');

// const ZERO_BYTES32 = `0x${`0`.repeat(64)}`

// describe('MerkleDistributor', () => {
//     let wallet0, wallet1
//     let TestERC20, Distributor

//     before(async () => {
//         signers = await ethers.getSigners()
//         wallet0 = await signers[0].getAddress(); // by default, contracts get deployed from the 0th address
//         wallet1 = await signers[1].getAddress();

//         TestERC20 = await ethers.getContractFactory('TestERC20')
//         Distributor = await ethers.getContractFactory('MerkleDistributor')
//     })

//     beforeEach('deploy token', async () => {
//         token = await TestERC20.deploy('Aragon Network Token', 'ANT', 0)
//     })
    
//     describe('#token', () => {
//         it('returns the token address', async () => {
//             const distributor = await Distributor.deploy(token.address, ZERO_BYTES32)
//             expect(await distributor.token()).to.equal(token.address)
//         })
//     })

//     describe('#merkleRoot', () => {
//         it('returns the zero merkle root', async () => {
//             const distributor = await Distributor.deploy(token.address, ZERO_BYTES32)
//             expect(await distributor.merkleRoot()).to.equal(ZERO_BYTES32)
//         })
//     })

//     describe('two account tree', () => {
//         let distributor, tree

//         beforeEach('deploy', async () => {
//             tree = new BalanceTree([
//                 { account: wallet0, amount: BigNumber.from(100) },
//                 { account: wallet1, amount: BigNumber.from(101) },
//             ])

//             distributor = await Distributor.deploy(token.address, tree.getHexRoot())
//             await token.setBalance(distributor.address, 201)
//         })
  
//         it('successful claim', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             const receipt1 = await distributor.claim(0, wallet0, 100, proof0)
//             await expect(receipt1).to.emit(distributor, 'Claimed').withArgs(0, wallet0, 100);

//             const proof1 = tree.getProof(1, wallet1, BigNumber.from(101))
//             const receipt2 = await distributor.claim(1, wallet1, 101, proof1)
//             await expect(receipt2).to.emit(distributor, 'Claimed').withArgs(1, wallet1, 101);
//         })

//         it('transfers the token', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             expect(await token.balanceOf(wallet0)).to.equal(0)

//             await distributor.claim(0, wallet0, 100, proof0)
//             expect(await token.balanceOf(wallet0)).to.equal(100)
//         })

//         it('should not fail and should not transfer', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await token.setBalance(distributor.address, 99)
//             await distributor.claim(0, wallet0, 100, proof0)
//             expect(await token.balanceOf(distributor.address)).to.equal(99)
//             expect(await token.balanceOf(wallet0)).to.equal(0)
//         })

//         it('sets #isClaimed', async () => {
//             expect(await distributor.isClaimed(0)).to.equal(false)
//             expect(await distributor.isClaimed(1)).to.equal(false)

//             const proof = tree.getProof(0, wallet0, BigNumber.from(100))
//             await distributor.claim(0, wallet0, 100, proof)
//             expect(await distributor.isClaimed(0)).to.equal(true)
//             expect(await distributor.isClaimed(1)).to.equal(false)
//         })

//         it('returns unclaimed balance', async () => {
//             const proof = tree.getProof(0, wallet0, BigNumber.from(100))
//             expect(await distributor.unclaimedBalance(0, wallet0, 100, proof)).to.equal(100);
//         })

//         it('returns 0 when it is claimed', async () => {
//             const proof = tree.getProof(0, wallet0, BigNumber.from(100))
//             await distributor.claim(0, wallet0, 100, proof)
//             expect(await distributor.unclaimedBalance(0, wallet0, 100, proof)).to.equal(0)
//         })

//         it('returns 0 for invalid proof', async () => {
//             expect(await distributor.unclaimedBalance(0, wallet0, 100, [ZERO_BYTES32])).to.equal(0)
//         })

        
//         it('cannot allow two claims', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await distributor.claim(0, wallet0, 100, proof0)
//             await expect(distributor.claim(0, wallet0, 100, proof0)).to.be.revertedWith('dist: already claimed');
//         })

//         it('cannot claim more than once: 0 and then 1', async () => {
//             const proof1 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await distributor.claim(0, wallet0, 100, proof1)
//             const proof2 = tree.getProof(1, wallet1, BigNumber.from(101))
//             await distributor.claim(1, wallet1, 101, proof2)
            
//             await expect(distributor.claim(0, wallet0,  100, proof1)).to.be.revertedWith('dist: already claimed');
          
//         })

//         it('cannot claim more than once: 1 and then 0', async () => {
//             const proof1 = tree.getProof(1, wallet1, BigNumber.from(101))
//             await distributor.claim(1, wallet1, 101, proof1)
//             const proof2 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await distributor.claim(0, wallet0, 100, proof2)
            
//             await expect(distributor.claim(1, wallet1,  101, proof1)).to.be.revertedWith('dist: already claimed');
//         })

//         it('cannot claim for address other than proof', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await expect(distributor.claim(1, wallet1,  101, proof0)).to.be.revertedWith('dist: proof failed');
//         })

//         it('cannot claim more than proof', async () => {
//             const proof0 = tree.getProof(0, wallet0, BigNumber.from(100))
//             await expect(distributor.claim(0, wallet0,  101, proof0)).to.be.revertedWith('dist: proof failed');
//         })

//     })

//     describe('larger tree', async () => {

//         let distributor, tree
        
//         beforeEach('deploy', async () => {

//             const signerAddresses = await Promise.all(signers.map(signer => signer.getAddress()))

//             tree = new BalanceTree(
//                 signerAddresses.map((address, ix) => {
//                   return { account: address, amount: BigNumber.from(ix + 1) }
//                 })
//             )

//             distributor = await Distributor.deploy(token.address, tree.getHexRoot())
//             await token.setBalance(distributor.address, 201)
//         })
  
//         it('claim index 4', async () => {
//             const signer = await signers[4].getAddress();

//             const proof = tree.getProof(4, signer, BigNumber.from(5))
//             const receipt = await distributor.claim(4, signer, 5, proof)
//             await expect(receipt).to.emit(distributor, 'Claimed').withArgs(4, signer, 5);
//         })
  
//         it('claim index 9', async () => {
//             const signer = await signers[9].getAddress();
//             const proof = tree.getProof(9, signer, BigNumber.from(10))
//             const receipt = await distributor.claim(9, signer, 10, proof)
//             await expect(receipt).to.emit(distributor, 'Claimed').withArgs(9, signer, 10);
//         })
  
//     })

// })
