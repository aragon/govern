import { ETHERSCAN_API_KEY } from './constants';

export default class AbiFetcher {
  private readonly network: string;

  constructor(networkName: string) {
    this.network = networkName.toLowerCase();
  }

  private getBaseUrl(): string {
    return `https://api${
      this.network === 'mainnet' ? '' : `-${this.network}`
    }.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`;
  }

  async get(address: string): Promise<string | null> {
    const endpoint = `${this.getBaseUrl()}&module=contract&action=getabi&address=${address}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.message === 'OK') {
          return json.result;
        }
      }
    } catch (e) {
      // swallow error
    }
    return null;
  }
}
