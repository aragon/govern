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

export { getTokenPrice };
