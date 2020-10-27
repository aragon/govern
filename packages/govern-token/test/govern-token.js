const { ecsign, ecrecover } = require('ethereumjs-util')
const { keccak256 } = require('web3-utils')
const { bn, MAX_UINT256, ZERO_ADDRESS } = require('@aragon/contract-helpers-test')
const { assertBn, assertEvent, assertRevert } = require('@aragon/contract-helpers-test/src/asserts')
const { createDomainSeparator } = require('./helpers/erc712')
const { createPermitDigest, PERMIT_TYPEHASH } = require('./helpers/erc2612')
const { createTransferWithAuthorizationDigest, TRANSFER_WITH_AUTHORIZATION_TYPEHASH } = require('./helpers/erc3009')
const { tokenAmount } = require('./helpers/tokens')

const GovernToken = artifacts.require('GovernToken')

contract('GovernToken', ([_, minter, newMinter, holder1, holder2, newHolder]) => {
  let token

  async function itTransfersCorrectly(fn, { from, to, value }) {
    const isMint = from === ZERO_ADDRESS
    const isBurn = to === ZERO_ADDRESS

    const prevFromBal = await token.balanceOf(from)
    const prevToBal = await token.balanceOf(to)
    const prevSupply = await token.totalSupply()

    const receipt = await fn(from, to, value)

    if (isMint) {
      assertBn(await token.balanceOf(to), prevToBal.add(value), 'mint: to balance')
      assertBn(await token.totalSupply(), prevSupply.add(value), 'mint: total supply')
    } else if (isBurn) {
      assertBn(await token.balanceOf(from), prevFromBal.sub(value), 'burn: from balance')
      assertBn(await token.totalSupply(), prevSupply.sub(value), 'burn: total supply')
    } else {
      assertBn(await token.balanceOf(from), prevFromBal.sub(value), 'transfer: from balance')
      assertBn(await token.balanceOf(to), prevToBal.add(value), 'transfer: to balance')
      assertBn(await token.totalSupply(), prevSupply, 'transfer: total supply')
    }

    assertEvent(receipt, 'Transfer', { expectedArgs: { from, to, value } })
  }

  async function itApprovesCorrectly(fn, { owner, spender, value }) {
    const receipt = await fn(owner, spender, value)

    assertBn(await token.allowance(owner, spender), value, 'approve: allowance')
    assertEvent(receipt, 'Approval', { expectedArgs: { owner, spender, value } })
  }

  beforeEach('deploy GovernToken', async () => {
    token = await GovernToken.new(minter, 'Aragon Network Token', 'ANT', 18)

    await token.mint(holder1, tokenAmount(100), { from: minter })
    await token.mint(holder2, tokenAmount(200), { from: minter })
  })

  it('set up the token correctly', async () => {
    assert.equal(await token.name(), 'Aragon Network Token', 'token: name')
    assert.equal(await token.symbol(), 'ANT', 'token: symbol')
    assert.equal(await token.decimals(), '18', 'token: decimals')

    assertBn(await token.totalSupply(), tokenAmount(300))
    assertBn(await token.balanceOf(holder1), tokenAmount(100))
    assertBn(await token.balanceOf(holder2), tokenAmount(200))
  })

  context('mints', () => {
    context('is minter', () => {
      it('can mint tokens', async () => {
        await itTransfersCorrectly(
          (_, to, value) => token.mint(to, value, { from: minter }),
          {
            from: ZERO_ADDRESS,
            to: newHolder,
            value: tokenAmount(100)
          }
        )
      })

      it('can change minter', async () => {
        const receipt = await token.changeMinter(newMinter, { from: minter })

        assert.equal(await token.minter(), newMinter, 'minter: changed')
        assertEvent(receipt, 'ChangeMinter', { expectedArgs: { minter: newMinter } })
      })
    })

    context('not minter', () => {
      it('cannot mint tokens', async () => {
        await assertRevert(token.mint(newHolder, tokenAmount(100), { from: holder1 }), 'token: not minter')
      })

      it('cannot change minter', async () => {
        await assertRevert(token.changeMinter(newMinter, { from: holder1 }), 'token: not minter')
      })
    })
  })

  context('transfers', () => {
    context('holds bag', () => {
      it('can transfer tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transfer(to, value, { from }),
          {
            from: holder1,
            to: newHolder,
            value: (await token.balanceOf(holder1)).sub(tokenAmount(1))
          }
        )
      })

      it('can transfer all tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transfer(to, value, { from }),
          {
            from: holder1,
            to: newHolder,
            value: await token.balanceOf(holder1)
          }
        )
      })

      it('cannot transfer above balance', async () => {
        await assertRevert(
          token.transfer(newHolder, (await token.balanceOf(holder1)).add(bn('1')), { from: holder1 }),
          'math: underflow'
        )
      })

      it('cannot transfer to token', async () => {
        await assertRevert(
          token.transfer(token.address, bn('1'), { from: holder1 }),
          'token: bad to'
        )
      })

      it('cannot transfer to zero address', async () => {
        await assertRevert(
          token.transfer(ZERO_ADDRESS, bn('1'), { from: holder1 }),
          'token: bad to'
        )
      })
    })

    context('bagless', () => {
      it('cannot transfer any', async () => {
        await assertRevert(
          token.transfer(holder1, bn('1'), { from: newHolder }),
          'math: underflow'
        )
      })
    })
  })

  context('approvals', () => {
    const owner = holder1
    const spender = newHolder

    context('has allowance', () => {
      const value = tokenAmount(50)

      beforeEach(async () => {
        await token.approve(spender, value, { from: owner })
      })

      it('can change allowance', async () => {
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value, { from: owner }),
          { owner, spender, value: value.add(tokenAmount(10)) }
        )
      })

      it('can transfer below allowance', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value, { from: spender }),
          {
            from: owner,
            to: spender,
            value: value.sub(tokenAmount(1))
          }
        )
      })

      it('can transfer all of allowance', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value, { from: spender }),
          {
            from: owner,
            to: spender,
            value: value.sub(tokenAmount(1))
          }
        )
      })

      it('cannot transfer above balance', async () => {
        await assertRevert(
          token.transferFrom(owner, spender, value.add(bn('1')), { from: spender }),
          'math: underflow'
        )
      })

      it('cannot transfer to token', async () => {
        await assertRevert(
          token.transferFrom(owner, token.address, bn('1'), { from: spender }),
          'token: bad to'
        )
      })

      it('cannot transfer to zero address', async () => {
        await assertRevert(
          token.transferFrom(owner, ZERO_ADDRESS, bn('1'), { from: spender }),
          'token: bad to'
        )
      })
    })

    context('has infinity allowance', () => {
      beforeEach(async () => {
        await token.approve(spender, MAX_UINT256, { from: owner })
      })

      it('can change allowance', async () => {
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value, { from: owner }),
          { owner, spender, value: tokenAmount(10) }
        )
      })

      it('can transfer without changing allowance', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.transferFrom(from, to, value, { from: spender }),
          {
            from: owner,
            to: spender,
            value: await token.balanceOf(owner)
          }
        )

        assertBn(await token.allowance(owner, spender), MAX_UINT256, 'approve: stays infinity')
      })

      it('cannot transfer above balance', async () => {
        await assertRevert(
          token.transferFrom(owner, spender, (await token.balanceOf(owner)).add(bn('1')), { from: spender }),
          'math: underflow'
        )
      })
    })

    context('no allowance', () => {
      it('can increase allowance', async () => {
        await itApprovesCorrectly(
          (owner, spender, value) => token.approve(spender, value, { from: owner }),
          { owner, spender, value: tokenAmount(10) }
        )
      })

      it('cannot transfer', async () => {
        await assertRevert(
          token.transferFrom(owner, spender, bn('1'), { from: spender }),
          'math: underflow'
        )
      })
    })
  })

  context('burns', () => {
    context('holds bag', () => {
      it('can burn tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.burn(value, { from }),
          {
            from: holder1,
            to: ZERO_ADDRESS,
            value: (await token.balanceOf(holder1)).sub(tokenAmount(1))
          }
        )
      })

      it('can burn all tokens', async () => {
        await itTransfersCorrectly(
          (from, to, value) => token.burn(value, { from }),
          {
            from: holder1,
            to: ZERO_ADDRESS,
            value: await token.balanceOf(holder1)
          }
        )
      })

      it('cannot burn above balance', async () => {
        await assertRevert(
          token.burn((await token.balanceOf(holder1)).add(bn('1')), { from: holder1 }),
          'math: underflow'
        )
      })
    })

    context('bagless', () => {
      it('cannot burn any', async () => {
        await assertRevert(
          token.burn(bn('1'), { from: newHolder }),
          'math: underflow'
        )
      })
    })

    it('can burn all tokens', async () => {
      await itTransfersCorrectly(
        (from, to, value) => token.burn(value, { from }),
        {
          from: holder1,
          to: ZERO_ADDRESS,
          value: await token.balanceOf(holder1)
        }
      )
      await itTransfersCorrectly(
        (from, to, value) => token.burn(value, { from }),
        {
          from: holder2,
          to: ZERO_ADDRESS,
          value: await token.balanceOf(holder2)
        }
      )

      assertBn(await token.totalSupply(), 0, 'burn: no total supply')
    })
  })

  context('ERC-712', () => {
    it('has the correct ERC712 domain separator', async () => {
      const domainSeparator = createDomainSeparator(
        await token.name(),
        bn('1'),
        await token.getChainId(),
        token.address
      )
      assert.equal(await token.getDomainSeparator(), domainSeparator, 'erc712: domain')
    })
  })

  context('ERC-2612', () => {
    let owner, ownerPrivKey
    const spender = newHolder

    async function createPermitSignature(owner, spender, value, nonce, deadline) {
      const digest = await createPermitDigest(token, owner, spender, value, nonce, deadline)

      const { r, s, v } = ecsign(
        Buffer.from(digest.slice(2), 'hex'),
        Buffer.from(ownerPrivKey.slice(2), 'hex')
      )

      return { r, s, v }
    }

    before(async () => {
      const wallet = web3.eth.accounts.create('erc2612')
      owner = wallet.address
      ownerPrivKey = wallet.privateKey
    })

    beforeEach(async () => {
      await token.mint(owner, tokenAmount(50), { from: minter })
    })

    it('has the correct permit typehash', async () => {
      assert.equal(await token.PERMIT_TYPEHASH(), PERMIT_TYPEHASH, 'erc2612: typehash')
    })

    it('can set allowance through permit', async () => {
      const deadline = MAX_UINT256

      const firstValue = tokenAmount(100)
      const firstNonce = await token.nonces(owner)
      const firstSig = await createPermitSignature(owner, spender, firstValue, firstNonce, deadline)
      const firstReceipt = await token.permit(owner, spender, firstValue, deadline, firstSig.v, firstSig.r, firstSig.s)

      assertBn(await token.allowance(owner, spender), firstValue, 'erc2612: first permit allowance')
      assertBn(await token.nonces(owner), firstNonce.add(bn(1)), 'erc2612: first permit nonce')
      assertEvent(firstReceipt, 'Approval', { expectedArgs: { owner, spender, value: firstValue } })

      const secondValue = tokenAmount(500)
      const secondNonce = await token.nonces(owner)
      const secondSig = await createPermitSignature(owner, spender, secondValue, secondNonce, deadline)
      const secondReceipt = await token.permit(owner, spender, secondValue, deadline, secondSig.v, secondSig.r, secondSig.s)

      assertBn(await token.allowance(owner, spender), secondValue, 'erc2612: second permit allowance')
      assertBn(await token.nonces(owner), secondNonce.add(bn(1)), 'erc2612: second permit nonce')
      assertEvent(secondReceipt, 'Approval', { expectedArgs: { owner, spender, value: secondValue } })
    })

    it('cannot use wrong signature', async () => {
      const deadline = MAX_UINT256
      const nonce = await token.nonces(owner)

      const firstValue = tokenAmount(100)
      const secondValue = tokenAmount(500)
      const firstSig = await createPermitSignature(owner, spender, firstValue, nonce, deadline)
      const secondSig = await createPermitSignature(owner, spender, secondValue, nonce, deadline)

      // Use a mismatching signature
      await assertRevert(token.permit(owner, spender, firstValue, deadline, secondSig.v, secondSig.r, secondSig.s), 'token: bad sig')
    })

    it('cannot use expired permit', async () => {
      const value = tokenAmount(100)
      const nonce = await token.nonces(owner)

      // Use a prior deadline
      const now = bn((await web3.eth.getBlock('latest')).timestamp)
      const deadline = now.sub(bn(60))

      const { r, s, v } = await createPermitSignature(owner, spender, value, nonce, deadline)
      await assertRevert(token.permit(owner, spender, value, deadline, v, r, s), 'token: auth expired')
    })

    it('cannot use surpassed permit', async () => {
      const deadline = MAX_UINT256
      const nonce = await token.nonces(owner)

      // Generate two signatures with the same nonce and use one
      const firstValue = tokenAmount(100)
      const secondValue = tokenAmount(500)
      const firstSig = await createPermitSignature(owner, spender, firstValue, nonce, deadline)
      const secondSig = await createPermitSignature(owner, spender, secondValue, nonce, deadline)

      // Using one should disallow the other
      await token.permit(owner, spender, secondValue, deadline, secondSig.v, secondSig.r, secondSig.s)
      await assertRevert(token.permit(owner, spender, firstValue, deadline, firstSig.v, firstSig.r, firstSig.s), 'token: bad sig')
    })
  })

  context('ERC-3009', () => {
    let from, fromPrivKey
    const to = newHolder

    async function createTransferWithAuthorizationSignature(from, to, value, validBefore, validAfter, nonce) {
      const digest = await createTransferWithAuthorizationDigest(token, from, to, value, validBefore, validAfter, nonce)

      const { r, s, v } = ecsign(
        Buffer.from(digest.slice(2), 'hex'),
        Buffer.from(fromPrivKey.slice(2), 'hex')
      )

      return { r, s, v }
    }

    before(async () => {
      const wallet = web3.eth.accounts.create('erc3009')
      from = wallet.address
      fromPrivKey = wallet.privateKey
    })

    beforeEach(async () => {
      await token.mint(from, tokenAmount(50), { from: minter })
    })

    it('has the correct transferWithAuthorization typehash', async () => {
      assert.equal(await token.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), TRANSFER_WITH_AUTHORIZATION_TYPEHASH, 'erc3009: typehash')
    })

    it('can transfer through transferWithAuthorization', async () => {
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstNonce = keccak256('first')
      const secondNonce = keccak256('second')
      assert.equal(await token.authorizationState(from, firstNonce), false, 'erc3009: first auth unused')
      assert.equal(await token.authorizationState(from, secondNonce), false, 'erc3009: second auth unused')

      const firstValue = tokenAmount(25)
      const firstSig = await createTransferWithAuthorizationSignature(from, to, firstValue, validAfter, validBefore, firstNonce)
      await itTransfersCorrectly(
        () => token.transferWithAuthorization(from, to, firstValue, validAfter, validBefore, firstNonce, firstSig.v, firstSig.r, firstSig.s),
        { from, to, value: firstValue }
      )
      assert.equal(await token.authorizationState(from, firstNonce), true, 'erc3009: first auth')

      const secondValue = tokenAmount(10)
      const secondSig = await createTransferWithAuthorizationSignature(from, to, secondValue, validAfter, validBefore, secondNonce)
      await itTransfersCorrectly(
        () => token.transferWithAuthorization(from, to, secondValue, validAfter, validBefore, secondNonce, secondSig.v, secondSig.r, secondSig.s),
        { from, to, value: secondValue }
      )
      assert.equal(await token.authorizationState(from, secondNonce), true, 'erc3009: second auth')
    })

    it('cannot transfer above balance', async () => {
      const value = (await token.balanceOf(from)).add(bn('1'))
      const nonce = keccak256('nonce')
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(from, to, value, validAfter, validBefore, nonce)
      await assertRevert(
        token.transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, v, r, s),
        'math: underflow'
      )
    })

    it('cannot transfer to token', async () => {
      const value = tokenAmount(100)
      const nonce = keccak256('nonce')
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(from, token.address, value, validAfter, validBefore, nonce)
      await assertRevert(
        token.transferWithAuthorization(from, token.address, value, validAfter, validBefore, nonce, v, r, s),
        'token: bad to'
      )
    })

    it('cannot transfer to zero address', async () => {
      const value = tokenAmount(100)
      const nonce = keccak256('nonce')
      const validAfter = 0
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(from, ZERO_ADDRESS, value, validAfter, validBefore, nonce)
      await assertRevert(
        token.transferWithAuthorization(from, ZERO_ADDRESS, value, validAfter, validBefore, nonce, v, r, s),
        'token: bad to'
      )
    })

    it('cannot use wrong signature', async () => {
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstNonce = keccak256('first')
      const firstValue = tokenAmount(25)
      const firstSig = await createTransferWithAuthorizationSignature(from, to, firstValue, validAfter, validBefore, firstNonce)

      const secondNonce = keccak256('second')
      const secondValue = tokenAmount(10)
      const secondSig = await createTransferWithAuthorizationSignature(from, to, secondValue, validAfter, validBefore, secondNonce)

      // Use a mismatching signature
      await assertRevert(
        token.transferWithAuthorization(from, to, firstValue, validAfter, validBefore, firstNonce, secondSig.v, secondSig.r, secondSig.s),
        'token: bad sig'
      )
    })

    it('cannot use before valid period', async () => {
      const value = tokenAmount(100)
      const nonce = keccak256('nonce')

      // Use a future period
      const now = bn((await web3.eth.getBlock('latest')).timestamp)
      const validAfter = now.add(bn(60))
      const validBefore = MAX_UINT256

      const { r, s, v } = await createTransferWithAuthorizationSignature(from, to, value, validAfter, validBefore, nonce)
      await assertRevert(
        token.transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, v, r, s),
        'token: auth wait'
      )
    })

    it('cannot use after valid period', async () => {
      const value = tokenAmount(100)
      const nonce = keccak256('nonce')

      // Use a prior period
      const now = bn((await web3.eth.getBlock('latest')).timestamp)
      const validBefore = now.sub(bn(60))
      const validAfter = 0

      const { r, s, v } = await createTransferWithAuthorizationSignature(from, to, value, validAfter, validBefore, nonce)
      await assertRevert(
        token.transferWithAuthorization(from, to, value, validAfter, validBefore, nonce, v, r, s),
        'token: auth expired'
      )
    })

    it('cannot use expired nonce', async () => {
      const nonce = keccak256('nonce')
      const validAfter = 0
      const validBefore = MAX_UINT256

      const firstValue = tokenAmount(25)
      const secondValue = tokenAmount(10)
      const firstSig = await createTransferWithAuthorizationSignature(from, to, firstValue, validAfter, validBefore, nonce)
      const secondSig = await createTransferWithAuthorizationSignature(from, to, secondValue, validAfter, validBefore, nonce)

      // Using one should disallow the other
      await token.transferWithAuthorization(from, to, firstValue, validAfter, validBefore, nonce, firstSig.v, firstSig.r, firstSig.s)
      await assertRevert(
        token.transferWithAuthorization(from, to, secondValue, validAfter, validBefore, nonce, secondSig.v, secondSig.r, secondSig.s),
        'token: auth used'
      )
    })
  })
})
