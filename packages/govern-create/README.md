# Govern create

This package contains the factory contracts:

- `GovernFactory`
- `GovernQueueFactory`
- `GovernBaseFactory`

# Configuration

First, run `yarn` to install all the dependencies.

Then, create the `.env` file in the root directory of this package and include those:

- `ETHERSCAN_KEY=YOUR_ETHERSCAN_API_KEY`
- `PRIVATE_KEY=YOUR_PRIVATE_KEY` (depending on the network, update this value for the corresponding private key)

If you don't want to verify contracts on etherscan right away after deploying the contracts, you can omit `ETHERSCAN_KEY` from the `.env` config.

# Deployment

After the configuration step is done, you can run `yarn deploy`.
