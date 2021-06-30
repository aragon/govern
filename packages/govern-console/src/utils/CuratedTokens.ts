import { networkEnvironment } from 'environment';
import { TokenSymbol } from 'environment/types';
const { curatedTokens } = networkEnvironment;

export class CuratedTokens {
  private readonly tokenSymbols: Array<TokenSymbol>;

  constructor() {
    this.tokenSymbols = Object.keys(curatedTokens) as TokenSymbol[];
  }

  getTokenSymbols(): Array<string> {
    return Object.keys(curatedTokens).concat('Other...');
  }

  isCustomToken(tokenIndex: number): boolean {
    return tokenIndex >= this.tokenSymbols.length;
  }

  getTokenAddress(tokenIndex: number, customTokenAddress: string): string {
    return this.isCustomToken(tokenIndex)
      ? customTokenAddress
      : curatedTokens[this.tokenSymbols[tokenIndex]];
  }
}
