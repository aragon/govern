// 0x6b175474e89094c44da98b954eedeac495271d0f
async function getTokenPrice(tokenAddress: string) {
  console.log(tokenAddress, '0x6b175474e89094c44da98b954eedeac495271d0f');
  const apiUrl = `https://api.0x.org/swap/v1/price?buyAmount=1000000000000000000&buyToken=${tokenAddress}&sellToken=USDC`;
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
        data: jsonResponse,
        error: null,
      };
    }

    return {
      data: null,
      error: { code: jsonResponse.code, message: jsonResponse.message },
    };
  } catch (err) {
    console.log('ERROR-Fetching Prices', err);
  }
}

/**
 * Gets the migration balances
 * @param organizationAddress organization executor address
 * @returns array of assets
 */
async function getMigrationBalances(organizationAddress: string) {
  const baseUrl = 'https://datafeed.aragon.org/organizations';
  try {
    const rawResponse = await fetch(`${baseUrl}/${organizationAddress}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const jsonResponse = await rawResponse.json();
    return rawResponse.ok ? jsonResponse.balances : [];
    // return [
    //   {
    //     asset: {
    //       address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    //       symbol: 'USDC',
    //       decimals: '6',
    //     },
    //     price: 1.0026038727,
    //     amount: '10000000000',
    //     value: 10026.0387275834,
    //   },
    //   {
    //     asset: {
    //       address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    //       symbol: 'UNI',
    //       decimals: '18',
    //     },
    //     price: 25.592698771,
    //     amount: '10000000000000000000',
    //     value: 255.9269877101,
    //   },
    // ];
  } catch (err) {
    console.log(err);
  }
}

export { getMigrationBalances, getTokenPrice };
