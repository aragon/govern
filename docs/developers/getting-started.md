---
description: Get up and running quickly with Govern as a Developer.
---

# Getting started

The Govern project consists of several sub projects interacting with each other.

## Contracts

The contracts are split in two projects: [`erc3k`](https://github.com/aragon/govern/blob/master/packages/erc3k) (the interfaces defining the ERC3000 standard), and [`govern-core`](https://github.com/aragon/govern/blob/master/packages/govern-core) (the Aragon Govern contracts, implementing ERC3000).

Relevant packages:

- [`erc3k`](https://github.com/aragon/govern/blob/master/packages/erc3k): ERC3000 interfaces.
- [`Govern Core`](https://github.com/aragon/govern/blob/master/packages/govern-core): Aragon ERC3000 implementation.
- [`Govern Create`](https://github.com/aragon/govern/blob/master/packages/govern-create): Set of templates used to create new Govern instances.
- [`Govern Contract Utils`](https://github.com/aragon/govern/blob/master/packages/govern-contract-utils): Set of libraries and utilities used by the Govern contracts.

## Govern Console

The Aragon Govern Console is a no-frills, forkable, extensible power user / developer UI tool for interacting with and visualizing low level information about Govern DAOs. Available on [console.aragon.org](https://console.aragon.org).

![The Aragon Govern Console](https://user-images.githubusercontent.com/36158/97722356-77c04900-1ac2-11eb-8a5c-5034a54cdbb4.png)

Relevant packages:

- [`Govern Console`](https://github.com/aragon/govern/blob/master/packages/govern-console).

## Govern Server and Govern.js

Govern Server acts as a central point, fetching data from different sources (Ethereum, the Govern subgraph, IPFS) and providing it as a unified API to consumers. You can use it through the Govern.js library, or through [its GraphQL API](./server-api.md). It is powered by [The Graph](https://thegraph.com/).

![Govern Server and how it relates to the other projects](https://user-images.githubusercontent.com/36158/97721073-e9979300-1ac0-11eb-9373-e007d4e6ce2c.png)

Relevant packages:

- [`Govern.js`](https://github.com/aragon/govern/blob/master/packages/govern).
- [`Govern Server`](https://github.com/aragon/govern/blob/master/packages/govern-server).
- [`Govern Subgraph`](https://github.com/aragon/govern/blob/master/packages/govern-subgraph).

## Development environment setup

Start by bootstrapping the entire monorepo with `yarn`:

```text
yarn
```

This will install all needed dependencies, and link all packages together to make sure you're using the local version of each one. After this, we can go and init our local development environment. Go ahead, and use the following command:

```bash
# For this to work, you'll need to have docker installed.
yarn init:dev:env
```

This will, in order:

- Compile all contracts, in the correct order
- Extract all ABIs so the subgraph can reference them properly
- Init a set of containers with an IPFS node, a local Ethereum node \(using Ganache\), and a local instance of the subgraph.

With this, you'll have a local development environment where you can deploy the entire Govern infra, and query the subgraph.

{% hint style="info" %}
Right now, all of this is manual; later down the road a more complete development environment with multiple network options \(mainnet fork, and clean local environment with dummy data\) will be made to make test runs easier.
{% endhint %}
