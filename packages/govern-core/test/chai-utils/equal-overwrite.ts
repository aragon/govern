import { BigNumber } from 'ethers'

// this function is adapted from Waffle
const deepEqual = (actual: any, expected: any): boolean => {
  // if they don't match by type, then fail
  if (typeof actual !== typeof expected) {
    return false
  }

  // recurse through each array element
  if (Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      return false
    }

    for (let i = 0; i < actual.length; i++) {
      const result = deepEqual(actual[i], expected[i])
      if (result === false) return false
    }
    return true
  }

  // compare BigNumbers
  if (BigNumber.isBigNumber(actual)) {
    return actual.eq(expected)
  }

  // otherwise direct compare
  return actual === expected
}

export function equalOverwrite(
  Assertion: Chai.AssertionStatic,
  utils: Chai.ChaiUtils
) {
  // Overwrite the Waffle withArgs() event log args comparison logic
  // It was doing Assertion(array1).equal(array2) instead of deepEqual
  // and this cause tests to fail
  Assertion.overwriteMethod('equal', (_super: (...args: any[]) => any) => {
    return function (this: Chai.AssertionStatic, ...args: any[]) {
      const actual = utils.flag(this, 'object')
      const [expected] = args

      if (Array.isArray(actual)) {
        this.assert(
          deepEqual(actual, expected),
          `Expected ${expected} to equal ${actual}`,
          '',
          actual,
          expected
        )
      } else {
        _super.apply(this, args)
      }
    }
  })
}
