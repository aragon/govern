import { BigNumber, providers } from 'ethers';
import { TokenSymbol } from 'environment/types';
import { constants, utils } from 'ethers';
import { getTokenInfo } from 'utils/token';
import { networkEnvironment } from 'environment';
const { curatedTokens } = networkEnvironment;

export const ETH = {
  symbol: 'ETH',
  decimals: 18,
  address: constants.AddressZero,
};

export const OTHER_TOKEN_SYMBOL = 'Other...';

type AssetType = 'eth' | 'curated' | 'other';

export type AssetLabel = TokenSymbol | 'ETH' | 'Other...';

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
    public type: AssetType,
  ) {
    this.amount = utils.parseUnits(displayAmount, decimals);
  }

  /**
   * create an instance of asset from the given token contract address
   * @param address token contract address
   * @param displayAmount display amount (not the amount to be sent to the contract)
   * @param provider for accessing token information
   * @param assetType type of the asset, i.e. ETH, curated, or others..
   * @returns an instance of asset
   */
  static async createFromAddress(
    address: string,
    displayAmount: string,
    provider: providers.Web3Provider,
    assetType: AssetType = 'other',
  ) {
    const { symbol, decimals } = await getTokenInfo(address, provider);
    return new Asset(symbol || '', decimals || 0, address, displayAmount, assetType);
  }

  /**
   * create an instance of asset from the given label in the deposit/withdrawal drop down list
   * @param label asset label in the dropdown list
   * @param address token contract address
   * @param displayAmount display amount (not the amount to be sent to the contract)
   * @param provider for accessing token information
   * @returns an instance of asset
   */
  static async createFromDropdownLabel(
    label: AssetLabel,
    tokenAddress: string,
    displayAmount: string,
    provider: providers.Web3Provider,
  ) {
    if (label === ETH.symbol) {
      return new Asset(ETH.symbol, ETH.decimals, ETH.address, displayAmount, 'eth');
    }

    const assetType: AssetType = Asset.getAssetType(label, tokenAddress);
    const assetAddress = Asset.isCustomToken(label)
      ? tokenAddress
      : curatedTokens[label as TokenSymbol];

    return Asset.createFromAddress(assetAddress, displayAmount, provider, assetType);
  }

  /**
   * Get the token type (curated or custom)
   * @param label - asset label
   * @param tokenAddress - token address
   * @returns whether token is curated
   */
  static getAssetType(label: AssetLabel, tokenAddress: string): AssetType {
    // if addresses are not the same as curated: still other token (i.e. custom token)
    return curatedTokens[label as TokenSymbol] === tokenAddress ? 'curated' : 'other';
  }

  /**
   * Is this ETH?
   * @returns boolean - true for ETH, false for not ETH
   */
  isEth() {
    return this.type === 'eth';
  }

  /**
   * Is this custom token
   * @param label token symbol
   * @returns true for custom token, false otherwise
   */
  static isCustomToken(label: AssetLabel) {
    return !curatedTokens.hasOwnProperty(label);
  }
}
