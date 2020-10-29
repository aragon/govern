---
description: Get up and running quickly with Govern as a Developer.
---

# Getting started

## Repo structure

This repo uses Lerna and yarn workspaces to bootstrap itself, and is divided into multiple independent sub-packages:

* [`erc3k`](https://github.com/aragon/govern/blob/master/packages/erc3k): Aragon's reference implementation of [ERC3000](https://eips.ethereum.org/EIPS/eip-3000), the up and coming governance standard.
* [`Govern.js`](https://github.com/aragon/govern/blob/master/packages/erc3kjs): Govern's official JS wrapper for creating seamless DAO experiences.
* [`Govern Console`](https://github.com/aragon/govern/blob/master/packages/govern-console): No-frills, forkable, extensible power user / developer UI tool for interacting with and visualizing low level information about Govern DAOs. Available on [console.aragon.org](https://console.aragon.org).
* [`Govern Contract Utils`](https://github.com/aragon/govern/blob/master/packages/govern-contract-utils): Set of all libraries and utilities used by the core Govern contracts.
* [`Govern Core`](https://github.com/aragon/govern/blob/master/packages/govern-core): The core set of Aragon Govern contracts.
* [`Govern Create`](https://github.com/aragon/govern/blob/master/packages/govern-create): Set of templates used to create new Govern instances.
* [`Govern Discord`](https://github.com/aragon/govern/blob/master/packages/govern-discord): Govern-native Discord bot for DAOs.
* [`Govern Server`](https://github.com/aragon/govern/blob/master/packages/govern-server): Server powering Govern.js and the Govern API to enable Web2-like experiences for DAOs.
* [`Govern Subgraph`](https://github.com/aragon/govern/blob/master/packages/govern-subgraph): Govern's official Subgraph, which tracks DAOs registered on the A1-deployed ERC3000Registry.

## Development environment setup

Start by bootstrapping the entire monorepo with `yarn`:

```text
yarn
```

This will install all needed dependencies, and link all packages together to make sure you're using the local version of each one. After this,  we can go and init our local development environment. Go ahead, and use the following command:

```bash
# For this to work, you'll need to have docker installed.
yarn init:dev:env
```

This will, in order:

* Compile all contracts, in the correct order
* Extract all ABIs so the subgraph can reference them properly
* Init a set of containers with an IPFS node, a local Ethereum node \(using Ganache\), and a local instance of the subgraph.

With this, you'll have a local development environment where you can deploy the entire Govern infra, and query the subgraph.

{% hint style="info" %}
Right now, all of this is manual; later down the road a more complete development environment with multiple network options \(mainnet fork, and clean local environment with dummy data\) will be made to make test runs easier.
{% endhint %}

