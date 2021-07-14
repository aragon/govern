const { keccak256, toUtf8Bytes, SigningKey } = require('ethers/lib/utils')
const { ZERO_ADDRESS } = require('@aragon/contract-helpers-test')
const { createDomainSeparator } = require('./helpers/erc712')
const { createPermitDigest, PERMIT_TYPEHASH } = require('./helpers/erc2612')
const {
  createTransferWithAuthorizationDigest,
  TRANSFER_WITH_AUTHORIZATION_TYPEHASH,
} = require('./helpers/erc3009')
const { BigNumber } = require('ethers')
const { expect } = require('chai')

const MAX_UINT256 = ethers.constants.MaxUint256

describe('GovernToken', async function () {
  let token
  let signers
  let minter, newMinter, holder1, holder2, newHolder
  let GovernToken

  before(async () => {
    signers = await ethers.getSigners()
    minter = await signers[0].getAddress()
    newMinter = await signers[1].getAddress()
    holder1 = await signers[2].getAddress()
    holder2 = await signers[3].getAddress()
    newHolder = await signers[4].getAddress()

    GovernToken = await ethers.getContractFactory('GovernToken')
  })

  async function itTransfersCorrectly(fn, { from, to, value }) {
    const isMint = from === ZERO_ADDRESS
    const isBurn = to === ZERO_ADDRESS

    const prevFromBal = await token.balanceOf(from)
    const prevToBal = await token.balanceOf(to)
    const prevSupply = await token.totalSupply()

    const receipt = await fn(from, to, value)

    if (isMint) {
      expect(await token.balanceOf(to)).to.equal(prevToBal.add(value))
      expect(await token.totalSupply()).to.equal(prevSupply.add(value))
    } else if (isBurn) {
      expect(await token.balanceOf(from)).to.equal(prevFromBal.sub(value))
      expect(await token.totalSupply()).to.equal(prevSupply.sub(value))
    } else {
      expect(await token.balanceOf(from)).to.equal(prevFromBal.sub(value))
      expect(await token.balanceOf(to)).to.equal(prevToBal.add(value))
      expect(await token.totalSupply()).to.equal(prevSupply)
    }

    await expect(receipt).to.emit(token, 'Transfer').withArgs(from, to, value)
  }

  async function itApprovesCorrectly(fn, { owner, spender, value }) {
    const receipt = await fn(owner, spender, value)

    expect(await token.allowance(owner, spender)).to.equal(value)
    await expect(receipt)
      .to.emit(token, 'Approval')
      .withArgs(owner, spender, value)
  }

  beforeEach('deploy GovernToken', async () => {
    token = await GovernToken.deploy(minter, 'Aragon Network Token', 'ANT', 18)

    await token.mint(holder1, BigNumber.from(100))
    await token.mint(holder2, BigNumber.from(200))
  })

  it('set up the token correctly', async () => {
    expect(await token.name()).to.equal('Aragon Network Token')
    expect(await token.symbol()).to.equal('ANT')
    expect(await token.decimals()).to.equal(18)

    expect(await token.totalSupply()).to.equal(BigNumber.from(300))
    expect(await token.balanceOf(holder1)).to.equal(BigNumber.from(100))
    expect(await token.balanceOf(holder2)).to.equal(BigNumber.from(200))
  })

  context('mints', () => {
    context('is minter', () => {
      it('can mint tokens', async () => {
        await itTransfersCorrectly((_, to, value) => token.mint(to, value), {
          from: ZERO_ADDRESS,
          to: newHolder,
          value: BigNumber.from(100),
        })
      })

      it('can change minter', async () => {
        const receipt = await token.changeMinter(newMinter)
        expect(await token.minter()).to.equal(newMinter)
        await expect(receipt).to.emit(token, 'ChangeMinter').withArgs(newMinter)
      })
    })

    context('not minter', () => {
      it('cannot mint tokens', async () => {
        token = token.connect(signers[2]) // holder1
        await expect(
          token.mint(newHolder, BigNumber.from(100))
        ).to.be.revertedWith('token: not minter')
      })

      it('cannot change minter', async () => {
        token = token.connect(signers[2]) // holder1
        await expect(token.changeMinter(newHolder)).to.be.revertedWith(
          'token: not minter'
        )
      })
    })
  })

  context('transfers', () => {
    context('holds bag', () => {
      beforeEach(() => {
        token = token.connect(signers[2]) // holder1
      })

      it('can transfer tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transfer(to, value),
          {
            from: holder1,
            to: newHolder,
            value: (await token.balanceOf(holder1)).sub(BigNumber.from(1)),
          }
        )
      })

      it('can transfer all tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transfer(to, value),
          {
            from: holder1,
            to: newHolder,
            value: await token.balanceOf(holder1),
          }
        )
      })

      it('cannot transfer above balance', async () => {
        const balance = (await token.balanceOf(holder1)).add(BigNumber.from(1))
        await expect(token.transfer(newHolder, balance)).to.be.revertedWith(
          'math: underflow'
        )
      })

      it('cannot transfer to token', async () => {
        await expect(
          token.transfer(token.address, BigNumber.from(1))
        ).to.be.revertedWith('token: bad to')
      })

      it('cannot transfer to zero address', async () => {
        await expect(
          token.transfer(ZERO_ADDRESS, BigNumber.from(1))
        ).to.be.revertedWith('token: bad to')
      })
    })

    context('bagless', () => {
      beforeEach(() => {
        token = token.connect(signers[4]) // newHolder
      })
      it('cannot transfer any', async () => {
        await expect(
          token.transfer(holder1, BigNumber.from(1))
        ).to.be.revertedWith('math: underflow')
      })
    })
  })

  context('approvals', () => {
    let owner
    let spender

    before(() => {
      owner = holder1
      spender = newHolder
    })

    context('has allowance', () => {
      const value = BigNumber.from(50)

      beforeEach(async () => {
        token = token.connect(signers[2]) // holder1
        await token.approve(spender, value)
        token = token.connect(signers[4]) // newHolder
      })

      it('can change allowance', async () => {
        token = token.connect(signers[2]) // holder1
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value),
          { owner, spender, value: value.add(BigNumber.from(10)) }
        )
      })

      it('can transfer below allowance', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value),
          {
            from: owner,
            to: spender,
            value: value.sub(BigNumber.from(1)),
          }
        )
      })

      it('can transfer all of allowance', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value),
          {
            from: owner,
            to: spender,
            value: value.sub(BigNumber.from(1)),
          }
        )
      })

      it('cannot transfer above balance', async () => {
        await expect(
          token.transferFrom(owner, spender, value.add(BigNumber.from(1)))
        ).to.be.revertedWith('math: underflow')
      })

      it('cannot transfer to token', async () => {
        await expect(
          token.transferFrom(owner, token.address, BigNumber.from(1))
        ).to.be.revertedWith('token: bad to')
      })

      it('cannot transfer to zero address', async () => {
        await expect(
          token.transferFrom(owner, ZERO_ADDRESS, BigNumber.from(1))
        ).to.be.revertedWith('token: bad to')
      })
    })

    context('has infinity allowance', () => {
      beforeEach(async () => {
        token = token.connect(signers[2]) // holder1
        await token.approve(spender, MAX_UINT256)
      })

      it('can change allowance', async () => {
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value),
          { owner, spender, value: BigNumber.from(10) }
        )
      })

      it('can transfer without changing allowance', async () => {
        token = token.connect(signers[4]) // newHolder
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value),
          {
            from: owner,
            to: spender,
            value: await token.balanceOf(owner),
          }
        )
        expect(await token.allowance(owner, spender)).to.equal(MAX_UINT256)
      })

      it('cannot transfer above balance', async () => {
        token = token.connect(signers[4])
        const balance = (await token.balanceOf(owner)).add(BigNumber.from('1'))
        await expect(
          token.transferFrom(owner, spender, balance)
        ).to.be.revertedWith('math: underflow')
      })
    })

    context('no allowance', () => {
      it('can increase allowance', async () => {
        token = token.connect(signers[2]) // holder1
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value),
          { owner, spender, value: BigNumber.from(10) }
        )
      })

      it('cannot transfer', async () => {
        token = token.connect(signers[4]) // newHolder
        await expect(
          token.transferFrom(owner, spender, BigNumber.from(1))
        ).to.be.revertedWith('math: underflow')
      })
    })
  })

  context('burns', () => {
    context('holds bag', () => {
      beforeEach(() => {
        token = token.connect(signers[2]) // holder1
      })

      it('can burn tokens', async () => {
        await itTransfersCorrectly((from, to, value) => token.burn(value), {
          from: holder1,
          to: ZERO_ADDRESS,
          value: (await token.balanceOf(holder1)).sub(BigNumber.from(1)),
        })
      })

      it('can burn all tokens', async () => {
        await itTransfersCorrectly((from, to, value) => token.burn(value), {
          from: holder1,
          to: ZERO_ADDRESS,
          value: await token.balanceOf(holder1),
        })
      })

      it('cannot burn above balance', async () => {
        const value = (await token.balanceOf(holder1)).add(BigNumber.from(1))
        await expect(token.burn(value)).to.be.revertedWith('math: underflow')
      })
    })

    context('bagless', () => {
      beforeEach(() => {
        token = token.connect(signers[4]) // newHolder
      })

      it('cannot burn any', async () => {
        await expect(token.burn(BigNumber.from(1))).to.be.revertedWith(
          'math: underflow'
        )
      })
    })

    it('can burn all tokens', async () => {
      token = token.connect(signers[2]) // holder1
      await itTransfersCorrectly((from, to, value) => token.burn(value), {
        from: holder1,
        to: ZERO_ADDRESS,
        value: await token.balanceOf(holder1),
      })
      token = token.connect(signers[3]) // holder2
      await itTransfersCorrectly((from, to, value) => token.burn(value), {
        from: holder2,
        to: ZERO_ADDRESS,
        value: await token.balanceOf(holder2),
      })

      expect(await token.totalSupply()).to.equal(0)
    })
  })

  context('ERC-712', () => {
    it('has the correct ERC712 domain separator', async () => {
      const domainSeparator = createDomainSeparator(
        await token.name(),
        '1',
        await token.getChainId(),
        token.address
      )

      expect(await token.getDomainSeparator()).to.equal(domainSeparator)
    })
  })

  context('ERC-2612', () => {
    let owner, ownerPrivKey
    let spender

    async function createPermitSignature(
      owner,
      spender,
      value,
      nonce,
      deadline
    ) {
      const digest = await createPermitDigest(
        token,
        owner,
        spender,
        value,
        nonce,
        deadline
      )

      const { r, s, v } = new SigningKey(ownerPrivKey).signDigest(digest)

      return { r, s, v }
    }

    before(async () => {
      const wallet = ethers.Wallet.createRandom()
      owner = wallet.address
      ownerPrivKey = wallet.privateKey
      spender = newHolder
    })

    beforeEach(async () => {
      token = token.connect(signers[0]) // minter
      await token.mint(owner, BigNumber.from(50))
    })

    it('has the correct permit typehash', async () => {
      expect(await token.PERMIT_TYPEHASH()).to.equal(PERMIT_TYPEHASH)
    })

    it('can set allowance through permit', async () => {
      const deadline = MAX_UINT256

      const firstValue = BigNumber.from(100)
      const firstNonce = await token.nonces(owner)
      const firstSig = await createPermitSignature(
        owner,
        spender,
        firstValue,
        firstNonce,
        deadline
      )
      const firstReceipt = await token.permit(
        owner,
        spender,
        firstValue,
        deadline,
        firstSig.v,
        firstSig.r,
        firstSig.s
      )

      expect(await token.allowance(owner, spender)).to.equal(firstValue)
      expect(await token.nonces(owner)).to.equal(
        firstNonce.add(BigNumber.from(1))
      )
      await expect(firstReceipt)
        .to.emit(token, 'Approval')
        .withArgs(owner, spender, firstValue)

      const secondValue = BigNumber.from(500)
      const secondNonce = await token.nonces(owner)
      const secondSig = await createPermitSignature(
        owner,
        spender,
        secondValue,
        secondNonce,
        deadline
      )
      const secondReceipt = await token.permit(
        owner,
        spender,
        secondValue,
        deadline,
        secondSig.v,
        secondSig.r,
        secondSig.s
      )

      expect(await token.allowance(owner, spender)).to.equal(secondValue)
      expect(await token.nonces(owner)).to.equal(
        secondNonce.add(BigNumber.from(1))
      )
      await expect(secondReceipt)
        .to.emit(token, 'Approval')
        .withArgs(owner, spender, secondValue)
    })

    it('cannot use wrong signature', async () => {
      const deadline = MAX_UINT256
      const nonce = await token.nonces(owner)

      const firstValue = BigNumber.from(100)
      const secondValue = BigNumber.from(500)
      const firstSig = await createPermitSignature(
        owner,
        spender,
        firstValue,
        nonce,
        deadline
      )
      const secondSig = await createPermitSignature(
        owner,
        spender,
        secondValue,
        nonce,
        deadline
      )

      // Use a mismatching signature
      await expect(
        token.permit(
          owner,
          spender,
          firstValue,
          deadline,
          secondSig.v,
          secondSig.r,
          secondSig.s
        )
      ).to.be.revertedWith('token: bad sig')
    })

    it('cannot use expired permit', async () => {
      const value = BigNumber.from(100)
      const nonce = await token.nonces(owner)

      // Use a prior deadline
      const now = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      const deadline = now.sub(BigNumber.from(60))

      const { r, s, v } = await createPermitSignature(
        owner,
        spender,
        value,
        nonce,
        deadline
      )
      await expect(
        token.permit(owner, spender, value, deadline, v, r, s)
      ).to.be.revertedWith('token: auth expired')
    })

    it('cannot use surpassed permit', async () => {
      const deadline = MAX_UINT256
      const nonce = await token.nonces(owner)

      // Generate two signatures with the same nonce and use one
      const firstValue = BigNumber.from(100)
      const secondValue = BigNumber.from(500)
      const firstSig = await createPermitSignature(
        owner,
        spender,
        firstValue,
        nonce,
        deadline
      )
      const secondSig = await createPermitSignature(
        owner,
        spender,
        secondValue,
        nonce,
        deadline
      )

      // Using one should disallow the other
      await token.permit(
        owner,
        spender,
        secondValue,
        deadline,
        secondSig.v,
        secondSig.r,
        secondSig.s
      )
      await expect(
        token.permit(
          owner,
          spender,
          firstValue,
          deadline,
          firstSig.v,
          firstSig.r,
          firstSig.s
        )
      ).to.be.revertedWith('token: bad sig')
    })
  })

  context('ERC-3009', () => {
    let from, ownerPrivKey
    let to

    async function createTransferWithAuthorizationSignature(
      from,
      to,
      value,
      validBefore,
      validAfter,
      nonce
    ) {
      const digest = await createTransferWithAuthorizationDigest(
        token,
        from,
        to,
        value,
        validBefore,
        validAfter,
        nonce
      )

      const { r, s, v } = new SigningKey(ownerPrivKey).signDigest(digest)

      return { r, s, v }
    }

    before(async () => {
      const wallet = ethers.Wallet.createRandom()
      from = wallet.address
      ownerPrivKey = wallet.privateKey
      to = newHolder
    })

    beforeEach(async () => {
      token = token.connect(signers[0]) // minter
      await token.mint(from, BigNumber.from(50))
    })

    it('has the correct transferWithAuthorization typehash', async () => {
      expect(await token.TRANSFER_WITH_AUTHORIZATION_TYPEHASH()).to.equal(
        TRANSFER_WITH_AUTHORIZATION_TYPEHASH
      )
    })

    it('can transfer through transferWithAuthorization', async () => {
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstNonce = keccak256(toUtf8Bytes('first'))
      const secondNonce = keccak256(toUtf8Bytes('second'))
      expect(await token.authorizationState(from, firstNonce)).to.equal(false)
      expect(await token.authorizationState(from, secondNonce)).to.equal(false)

      const firstValue = BigNumber.from(25)
      const firstSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        firstValue,
        validAfter,
        validBefore,
        firstNonce
      )
      await itTransfersCorrectly(
        () =>
          token.transferWithAuthorization(
            from,
            to,
            firstValue,
            validAfter,
            validBefore,
            firstNonce,
            firstSig.v,
            firstSig.r,
            firstSig.s
          ),
        { from, to, value: firstValue }
      )
      expect(await token.authorizationState(from, firstNonce)).to.equal(true)

      const secondValue = BigNumber.from(10)
      const secondSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        secondValue,
        validAfter,
        validBefore,
        secondNonce
      )
      await itTransfersCorrectly(
        () =>
          token.transferWithAuthorization(
            from,
            to,
            secondValue,
            validAfter,
            validBefore,
            secondNonce,
            secondSig.v,
            secondSig.r,
            secondSig.s
          ),
        { from, to, value: secondValue }
      )

      expect(await token.authorizationState(from, secondNonce)).to.equal(true)
    })

    it('cannot transfer above balance', async () => {
      const value = (await token.balanceOf(from)).add(BigNumber.from(1))
      const nonce = keccak256(toUtf8Bytes('nonce'))
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce
      )

      await expect(
        token.transferWithAuthorization(
          from,
          to,
          value,
          validAfter,
          validBefore,
          nonce,
          v,
          r,
          s
        )
      ).to.be.revertedWith('math: underflow')
    })

    it('cannot transfer to token', async () => {
      const value = BigNumber.from(100)
      const nonce = keccak256(toUtf8Bytes('nonce'))
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(
        from,
        token.address,
        value,
        validAfter,
        validBefore,
        nonce
      )

      await expect(
        token.transferWithAuthorization(
          from,
          token.address,
          value,
          validAfter,
          validBefore,
          nonce,
          v,
          r,
          s
        )
      ).to.be.revertedWith('token: bad to')
    })

    it('cannot transfer to zero address', async () => {
      const value = BigNumber.from(100)
      const nonce = keccak256(toUtf8Bytes('nonce'))
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(
        from,
        ZERO_ADDRESS,
        value,
        validAfter,
        validBefore,
        nonce
      )

      await expect(
        token.transferWithAuthorization(
          from,
          ZERO_ADDRESS,
          value,
          validAfter,
          validBefore,
          nonce,
          v,
          r,
          s
        )
      ).to.be.revertedWith('token: bad to')
    })

    it('cannot use wrong signature', async () => {
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstNonce = keccak256(toUtf8Bytes('first'))
      const firstValue = BigNumber.from(25)
      const firstSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        firstValue,
        validAfter,
        validBefore,
        firstNonce
      )

      const secondNonce = keccak256(toUtf8Bytes('second'))
      const secondValue = BigNumber.from(10)
      const secondSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        secondValue,
        validAfter,
        validBefore,
        secondNonce
      )

      // Use a mismatching signature

      await expect(
        token.transferWithAuthorization(
          from,
          to,
          firstValue,
          validAfter,
          validBefore,
          firstNonce,
          secondSig.v,
          secondSig.r,
          secondSig.s
        )
      ).to.be.revertedWith('token: bad sig')
    })

    it('cannot use before valid period', async () => {
      const value = BigNumber.from(100)
      const nonce = keccak256(toUtf8Bytes('nonce'))

      // Use a future period
      const now = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      const validAfter = now.add(BigNumber.from(60))
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce
      )

      await expect(
        token.transferWithAuthorization(
          from,
          to,
          value,
          validAfter,
          validBefore,
          nonce,
          v,
          r,
          s
        )
      ).to.be.revertedWith('token: auth wait')
    })

    it('cannot use after valid period', async () => {
      const value = BigNumber.from(100)
      const nonce = keccak256(toUtf8Bytes('nonce'))

      // Use a prior period
      const now = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      const validBefore = now.sub(BigNumber.from(60))
      const validAfter = 0

      const { r, s, v } = await createTransferWithAuthorizationSignature(
        from,
        to,
        value,
        validAfter,
        validBefore,
        nonce
      )

      await expect(
        token.transferWithAuthorization(
          from,
          to,
          value,
          validAfter,
          validBefore,
          nonce,
          v,
          r,
          s
        )
      ).to.be.revertedWith('token: auth expired')
    })

    it('cannot use expired nonce', async () => {
      const nonce = keccak256(toUtf8Bytes('nonce'))
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstValue = BigNumber.from(25)
      const secondValue = BigNumber.from(10)
      const firstSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        firstValue,
        validAfter,
        validBefore,
        nonce
      )
      const secondSig = await createTransferWithAuthorizationSignature(
        from,
        to,
        secondValue,
        validAfter,
        validBefore,
        nonce
      )

      // Using one should disallow the other
      await token.transferWithAuthorization(
        from,
        to,
        firstValue,
        validAfter,
        validBefore,
        nonce,
        firstSig.v,
        firstSig.r,
        firstSig.s
      )

      await expect(
        token.transferWithAuthorization(
          from,
          to,
          secondValue,
          validAfter,
          validBefore,
          nonce,
          secondSig.v,
          secondSig.r,
          secondSig.s
        )
      ).to.be.revertedWith('token: auth used')
    })
  })
})
