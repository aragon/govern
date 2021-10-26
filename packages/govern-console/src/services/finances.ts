import { constants } from 'ethers';

async function getTokenPrice(tokenAddress: string) {
  // Wrap Eth to WETH
  const token = tokenAddress === constants.AddressZero ? 'WETH' : tokenAddress;

  const apiUrl = `https://api.0x.org/swap/v1/price?sellToken=${token}&buyToken=USDC&sellAmount=1000000000000000000`;
  try {
    const rawResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const jsonResponse = await rawResponse.json();

    if (rawResponse.ok) {
      return {
        price: jsonResponse.price,
        error: null,
      };
    }

    return {
      price: null,
      error: { code: jsonResponse.code, message: jsonResponse.message },
    };
  } catch (err) {
    console.log('ERROR-Fetching price', err);
  }
}

/**
 * Gets the migration balances
 * @param organizationAddress organization executor address
 * @returns array of assets
 */

/*
 *This method is related to KPI options migration. See the link for more info.
 * https://blog.aragon.org/uma-kpi-options-airdrop-now-live-for-aragon-govern-daos/
 * Note: Only two Daos migrated
 */

function getMigrationBalances(organizationAddress: string) {
  const migratedAssets: any = {
    '0x7767a2e18f0C477b20E85Bd5252b3643D273cD25': {
      '0x6b175474e89094c44da98b954eedeac495271d0f': {
        symbol: 'DAI',
        decimals: 18,
        amount: BigInt(49754935512174713021665),
      },
    },
    '0xB3f7Adbb06c3698F4ce1D49228BB773856CE75C0': {
      '0x0d8775f648430679a709e98d2b0cb6250d2887ef': {
        symbol: 'BAT',
        decimals: 18,
        amount: BigInt(111417255096354137975),
      },
      '0x470e8de2ebaef52014a47cb5e6af86884947f08c': {
        symbol: 'UNI-V2',
        decimals: 18,
        amount: BigInt(1111000000000000000),
      },
      '0xae79584f9d143e4bc0b6068cfc145969f08f6f24': {
        symbol: 'UNI-V2',
        decimals: 18,
        amount: BigInt(1218482408335451251),
      },
      '0x514910771af9ca656af840dff83e8264ecf986ca': {
        symbol: 'LINK',
        decimals: 18,
        amount: BigInt(6117866183430548045),
      },
      '0xa8258abc8f2811dd48eccd209db68f25e3e34667': {
        symbol: 'DAG',
        decimals: 8,
        amount: BigInt(6000000000000),
      },
      '0xf5d669627376ebd411e34b98f19c868c8aba5ada': {
        symbol: 'AXS',
        decimals: 18,
        amount: BigInt(2000000000000000000),
      },
      '0x0000000000000000000000000000000000000000': {
        symbol: 'ETH',
        decimals: 18,
        amount: BigInt(100000000000000000),
      },
    },
  };

  return migratedAssets[organizationAddress] || {};
}

export { getMigrationBalances, getTokenPrice };
