import fetch from 'node-fetch'

class ERC3K {
  constructor(
    subgraphUrl = 'https://api.thegraph.com/subgraphs/name/evalir/aragon-eg-rinkeby-staging'
  ) {
    this.subgraphUrl = subgraphUrl
  }

  query(query) {
    return fetch(this.subgraphUrl, {
      method: 'POST',
      body: JSON.stringify({ query: query }),
    })
  }
}

export default ERC3K
