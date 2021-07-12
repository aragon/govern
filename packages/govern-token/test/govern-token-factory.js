const { formatBytes32String } = require('ethers/lib/utils')
const { expect } = require('chai')
const BalanceTree = require('./helpers/merkle-tree/balance-tree').default
const { BigNumber } = require('ethers')

const EVENTS = {
  MINTED_SINGLE: 'MintedSingle',
  MINTED_MERKLE: 'MintedMerkle',
  CREATED_TOKEN: 'CreatedToken'
}

const ERRORS = {
  ACL_AUTH: 'acl: auth',
  PROOF_FAILED: 'dist: proof failed'
}

describe('GovernTokenFactory', function () {
  let signers, owner, governExecutor, mintAddr, governTokenFactory
  let wallet0, wallet1 // distrubutor addresses
  let zero32Bytes = '0x'+'00'.repeat(32)

  before(async () => {
    signers = await ethers.getSigners()
    owner = await signers[0].getAddress()
    governExecutor = await signers[1].getAddress()
    mintAddr = await signers[2].getAddress()

    wallet0 = await signers[3].getAddress()
    wallet1 = await signers[4].getAddress()


    const tokenFactoryArtifact = await hre.artifacts.readArtifact('GovernTokenFactory');
    const minterArtifact = await hre.artifacts.readArtifact('GovernMinter');
    
    const mergedAbi = [
      ...tokenFactoryArtifact.abi,
      ...minterArtifact.abi.filter((f) => f.type === 'event' && f.name === EVENTS.MINTED_MERKLE)
    ]
    const GovernTokenFactory = new ethers.ContractFactory(mergedAbi, tokenFactoryArtifact.bytecode, signers[0]);
    governTokenFactory = await GovernTokenFactory.deploy();
  })

  async function getTokenAndMinter(tx) {
    const { events } = await tx.wait()
    const { token, minter } = events.find(
      ({ event }) => event === EVENTS.CREATED_TOKEN
    ).args
    return {
      token: await ethers.getContractAt('GovernToken', token),
      minter: await ethers.getContractAt('GovernMinter', minter),
    }
  }

  async function getMerkleDistributor(tx) {
    const { events } = await tx.wait();
    try {
      const { distributor } = events.find(
        ({ event }) => event === EVENTS.MINTED_MERKLE
      ).args
      return ethers.getContractAt('MerkleDistributor', distributor);
    }catch(err) {
      return null;
    }
  }

  let options = [
    {
      title: 'Deploys token and minter with proxies',
      params: {
        useProxies: true,
      },
    },
    {
      title: 'Deploys token and minter without proxies',
      params: {
        useProxies: false,
      },
    },
  ]

  // The following `options` tests should directly mimic to each other, since
  // changing `useProxies` parameter shouldn't affect anything in terms of logic
  // but with only gas costs.
  options.forEach((item) => {
    describe(item.title, async () => {
      let token, minter, merkleDistributor, tx
      let mintedAmount = 100
      let distributorMintedAmount = 10000
      let tree 

      before(async () => {
        tree = new BalanceTree([
          { account: wallet0, amount: BigNumber.from(100) },
          { account: wallet1, amount: BigNumber.from(101) },
        ])

        tx = await governTokenFactory.newToken(
          governExecutor,
          [
            '0x'+'0'.repeat(40),
            18, 
            "TokenName",
            "TokenSymbol",
            mintAddr,
            mintedAmount,
            zero32Bytes,
            0,
            '0x',
            '0x'
          ],
          item.useProxies
        )
        const data = await getTokenAndMinter(tx)
        token = data.token
        minter = data.minter
        merkleDistributor = await getMerkleDistributor(tx)
      })

      it('should not create merkle distributor when zero merkle root is passed', async () => {
        expect(merkleDistributor).to.equal(null)
      })
      
      it('checks if amount is minted and minter is the correct minter', async () => {
        expect(await token.balanceOf(mintAddr)).to.equal(mintedAmount)
        expect(await token.minter()).to.equal(minter.address)
        await expect(tx)
          .to.emit(minter, EVENTS.MINTED_SINGLE)
          // initial mint is 12 length, in bytes, it's 24 and plus 0x (overal 26)
          .withArgs(
            mintAddr,
            mintedAmount,
            formatBytes32String('initial mint').slice(0, 26)
          )
      })

      it('reverts if the mint is not called from GovernExecutor', async () => {
        let tx = minter.mint(mintAddr, mintedAmount, '0x')
        await expect(tx).to.be.revertedWith(ERRORS.ACL_AUTH)
      })

      it('reverts if root role function is not called from GovernExecutor', async () => {
        let tx = minter.grant(minter.interface.getSighash('mint'), owner)
        await expect(tx).to.be.revertedWith(ERRORS.ACL_AUTH)
      })

      it('succeeds if mint is called from the GovernExecutor', async () => {
        minter = minter.connect(signers[1]) // governExecutor
        let tx = minter.mint(mintAddr, mintedAmount, '0x')
        await expect(tx)
          .to.emit(minter, EVENTS.MINTED_SINGLE)
          .withArgs(mintAddr, mintedAmount, '0x')
      })

      it('succeeds if root role function is called from GovernExecutor', async () => {
        minter = minter.connect(signers[1]) // governExecutor
        let mintSelector = minter.interface.getSighash('mint')
        await minter.grant(mintSelector, owner)
        expect(await minter.roles(mintSelector, owner)).not.equal(
          `0x${'0'.repeat(40)}`
        )
      })
    })
  })


  describe('deploys with merkle distributor', async () => {
    let token, minter, merkleDistributor, tx
    let mintedAmount = 100
    let distributorMintedAmount = 200
    let tree 

    before(async () => {
      tree = new BalanceTree([
        { account: wallet0, amount: BigNumber.from(100) },
        { account: wallet1, amount: BigNumber.from(100) },
      ])

      tx = await governTokenFactory.newToken(
        governExecutor,
        [
          '0x'+'0'.repeat(40),
          18, 
          "TokenName",
          "TokenSymbol",
          mintAddr,
          mintedAmount,
          tree.getHexRoot(),
          distributorMintedAmount,
          '0x00',
          '0x11'
        ],
        true
      )
      const data = await getTokenAndMinter(tx)
      token = data.token
      minter = data.minter
      merkleDistributor = await getMerkleDistributor(tx)
    })

    it('creates merkle distributor when non zero merkle root is passed', async () => {
      await expect(tx)
        .to.emit(minter, EVENTS.MINTED_MERKLE)
        .withArgs(
          merkleDistributor.address,
          tree.getHexRoot(),
          distributorMintedAmount,
          "0x00",
          "0x11"
        )
      expect(await token.balanceOf(merkleDistributor.address)).to.equal(distributorMintedAmount)
      
      const proof0 = tree.getProof(0, wallet0, BigNumber.from(100));

      await expect(await merkleDistributor.claim(0, wallet0, 100, proof0))
        .to.emit(merkleDistributor, 'Claimed')
        .withArgs(0, wallet0, 100)

      await expect(merkleDistributor.claim(2, wallet0, 100, proof0)).to.be.revertedWith(ERRORS.PROOF_FAILED)
      
      expect(await merkleDistributor.merkleRoot()).to.equal(tree.getHexRoot())
    })
  })
})
