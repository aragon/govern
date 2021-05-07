const api = process.env.REACT_APP_ETHERSCAN_ENDPOINT;

export async function fetchAbi(address: string): Promise<string | null> {
  const endpoint = `${api}&module=contract&action=getabi&address=${address}`;

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
