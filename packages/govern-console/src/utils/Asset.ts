import { BigNumber, providers } from 'ethers';
import { TokenSymbol } from 'environment/types';
import { constants, utils } from 'ethers';
import { getToken } from '@aragon/govern';
import { networkEnvironment } from 'environment';
const { curatedTokens } = networkEnvironment;

export const ETH = {
  symbol: 'ETH',
  decimals: 18,
  address: constants.AddressZero,
};

export const OTHER_TOKEN_SYMBOL = 'Other...';

/**
 * Asset class with helper functions
 */
export class Asset {
  public amount: BigNumber;

  constructor(
    public symbol: string = '',
    public decimals: number = 0,
    public address: string,
    public displayAmount: string = '0',
  ) {
    this.amount = utils.parseUnits(displayAmount, decimals);
  }

  /**
   * create an instance of asset from the given token contract address
   * @param address token contract address
   * @param displayAmount display amount (not the amount to be sent to the contract)
   * @param provider for accesing token information
   * @returns an instance of asset
   */
  static async createFromAddress(
    address: string,
    displayAmount: string,
    provider: providers.Web3Provider,
  ) {
    try {
      const token = await getToken(address, provider);
      return new Asset(token.tokenSymbol, token.tokenDecimals, address, displayAmount);
    } catch (err) {
      console.log('error getting token information', address, err);
      // if decimal is not available, set to 0
      // if symbol not available, set to 0
      return new Asset('', 0, address, displayAmount);
    }
  }

  /**
   * create an instance of asset from the given token index in the ASSET_SYMBOLS list
   * @param assetSymbol symbol of the asset
   * @param address token contract address
   * @param displayAmount display amount (not the amount to be sent to the contract)
   * @param provider for accesing token information
   * @returns an instance of asset
   */
  static async createFromSymbol(
    assetSymbol: string,
    otherTokenAddress: string,
    displayAmount: string,
    provider: providers.Web3Provider,
  ) {
    if (Asset.isEth(assetSymbol)) {
      return new Asset(ETH.symbol, ETH.decimals, ETH.address, displayAmount);
    }

    const assetAddress = Asset.isOtherToken(assetSymbol)
      ? otherTokenAddress
      : curatedTokens[assetSymbol as TokenSymbol];

    return Asset.createFromAddress(assetAddress, displayAmount, provider);
  }

  /**
   * Is this ETH symbol?
   * @param symbol token symbol
   * @returns boolean - true for ETH, false for not ETH
   */
  static isEth(symbol: string) {
    return symbol === ETH.symbol;
  }

  /**
   * Is this token index for 'Other...' token?
   * @param index token index
   * @returns true for Other token, false otherwise
   */
  static isOtherToken(symbol: string): boolean {
    return symbol === OTHER_TOKEN_SYMBOL;
  }
}
