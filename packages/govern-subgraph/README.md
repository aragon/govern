![Aragon Govern header](../../raw/master/.github/govern.png)

# Aragon Govern Subgraph

## Quick Start

After installing the monorepo's dependencies, run:
- `yarn manifest-<YOUR_DESIRED_NETWORK>` to generate the corresponding `subgraph.yaml` file for the network.
- `yarn codegen` to generate the types needed for building the subgraph.
- `yarn deploy-<YOUR_DESIRED_NETWORK> <THEGRAPH_USERNAME> <SUBGRAPH_NAME> <YOUR_DESIRED_NETWORK>` to build and deploy the subgraph to the desired network. Remember to set your $GRAPHKEY environment variable and check the needed arguments!

## Networks and performance

This subgraph can be used for Aragon Govern on mainnet, and all testnets. In order to run it for a testnet, the subgraph.yaml file will need to have the contract addresses changed to point to the correct address for each respective network. Aragon One will have a history of deployments that you'll be able to use for this, but you can also deploy it yourself using the tasks set up in the `govern-core` package.

## Subgraph architecture and structure

Borrowing ideas from the original aragonOS subgraphs, we took the approach of leveraging [data source templates](https://thegraph.com/docs/define-a-subgraph#data-source-templates) and mustache templates for dynamically generating different subgraph configurations for different networks. The `manifest` folder contains both the data needed for filling the addresses for these environments (located inside the `data`) folder, and the templates needed for auto-filling the actual structure for the yaml files that define the contract entities. These all get funneled into the `subgraph.template.yaml` file, which moustache will take as template, and create the actual `subgraph.yaml` file needed for deployment.

## General information on Govern events and contracts

Govern contracts are small and simple compared to aragonOS, meaning that indexing activity is much easier. However, if you deployed your Govern DAO using proxies, it means that you *must* try and index every instance of the upgraded contract. If you're using one of the official Aragon Govern Factories this shouldn't be an issue, but if you can't find your ugpradeable DAO, don't hesitate to get in touch so we can index it, or just fork the repo and add the contract instance.

## Information on Contracts being Ingested by the Subgraph

As of right now, all contract events are ingested by the Graph Node, but over time we might leave some out due to not having useful information. The following is the list of contracts we index along with their events:

#### Govern.sol

Tracked:
- `Executed`
- `Frozen`
- `Granted`
- `Revoked`
Left out:
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
Left out: None.

#### ERC3000Registry.sol

Tracked:
- `Registered`
- `SetMetadata`
Left out: None.
