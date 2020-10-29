![Aragon Govern header](../../raw/master/.github/govern.png)

# Aragon Govern Subgraph

## Quick Start

Ensure the monorepo’s dependencies are installed:

```console
cd ../.. && yarn
cd packages/govern-subgraph
```

Generate the `subgraph.yaml` file corresponding to your network:

```console
yarn manifest-<DESIRED_NETWORK>
```

Replacing `<DESIRED_NETWORK>` by one of the available networks (see package.json).

Generate the types from the ABIs and the GraphQL schema:

```console
yarn codegen
```

The generated code is used by the subgraph mapping scripts. Compile the subgraph:

```console
yarn build
```

You are now ready to deploy the subgraph. This is the command to use:

```console
GRAPH_KEY=<GRAPH_KEY> yarn deploy-<DESIRED_NETWORK> <THEGRAPH_USERNAME> <SUBGRAPH_NAME> <DESIRED_NETWORK>
```

Replacing:

- `<GRAPH_KEY>` by your The Graph key (this is only needed when deploying on The Graph).
- `<THEGRAPH_USERNAME>` by the username used for your subgraph (usually your GitHub username).
- `<SUBGRAPH_NAME>` by the name of the subgraph itself.
- `<DESIRED_NETWORK>` by one of the available networks (see package.json).

### Deploy the subgraph locally

You have the option to deploy your subgraph locally, this is how you can do it.

Clone the Graph node repository somewhere on your computer:

```console
git clone git@github.com:graphprotocol/graph-node.git
```

Edit the file `graph-node/docker/docker-compose.yml` to make the [`ethereum` field](https://github.com/graphprotocol/graph-node/blob/ce9aa01dcc18029122f1cf3e8f6941ffffd7653e/docker/docker-compose.yml#L20) point to the Ethereum node of your choice. Make sure this node is connected to the same Ethereum network than the one expected by your subgraph.

Run the Graph node using docker-compose. It will start the Graph node itself, but also a PostgreSQL database and an IPFS, which are used by the Graph node.

```console
cd graph-node/docker
docker-compose up
```

You are now ready to deploy your subgraph.

Go back to the subgraph directory (`packages/govern-subgraph`), and create the subgraph on your local node:

```console
graph create aragon/aragon-govern-<DESIRED_NETWORK> \
  --node http://localhost:8020
```

Then deploy it:

```console
graph deploy aragon/aragon-govern<DESIRED_NETWORK> \
  --ipfs http://localhost:5001 \
  --node http://localhost:8020
```

To stop the Graph node, go back to its directory and run `docker-compose down`. It will also create a `data` directory: remember to delete it if you want to start again.

See [the Graph documentation](https://thegraph.com/docs/quick-start) for more details on how to run The Graph locally.

## Networks and performance

This subgraph can be used for Aragon Govern on mainnet, and all testnets. In order to run it for a testnet, the subgraph.yaml file will need to have the contract addresses changed to point to the correct address for each respective network. Aragon One will have a history of deployments that you'll be able to use for this, but you can also deploy it yourself using the tasks set up in the `govern-core` package.

## Subgraph architecture and structure

Borrowing ideas from the original aragonOS subgraphs, we took the approach of leveraging [data source templates](https://thegraph.com/docs/define-a-subgraph#data-source-templates) and mustache templates for dynamically generating different subgraph configurations for different networks. The `manifest` folder contains both the data needed for filling the addresses for these environments (located inside the `data`) folder, and the templates needed for auto-filling the actual structure for the yaml files that define the contract entities. These all get funneled into the `subgraph.template.yaml` file, which moustache will take as template, and create the actual `subgraph.yaml` file needed for deployment.

## General information on Govern events and contracts

Govern contracts are small and simple compared to aragonOS, meaning that indexing activity is much easier. However, if you deployed your Govern DAO using proxies, it means that you _must_ try and index every instance of the upgraded contract. If you're using one of the official Aragon Govern Factories this shouldn't be an issue, but if you can't find your ugpradeable DAO, don't hesitate to get in touch so we can index it, or just fork the repo and add the contract instance.

## Information on Contracts being Ingested by the Subgraph

As of right now, all contract events are ingested by the Graph Node, but over time we might leave some out due to not having useful information. The following is the list of contracts we index along with their events:

#### Govern.sol

Tracked:

- `Executed`
- `Frozen`
- `Granted`
- `Revoked`
- `ETHDeposited`

#### GovernQueue.sol

Tracked:

- `Configured`
- `Frozen`
- `Granted`
- `Scheduled`
- `Executed`
- `Challenged`
- `Vetoed`
- `Resolved`
- `Revoked`
- `EvidenceSubmitted`
- `Ruled`

#### GovernRegistry.sol

Tracked:

- `Registered`
- `SetMetadata`

