# Govern Token

This package contains the contracts for Token.

# Configuration

First, run `yarn` to install all the dependencies, if it hasn't been run before for any other package.

Then, create the `.env` file in the root directory of this package and include those:

- `PRIVATE_KEY=YOUR_PRIVATE_KEY`

`PRIVATE_KEY` is necessary to make sure you can deploy contracts.

# Deployment

- `yarn deploy` deploys `GovernTokenFactory` contract.
- `yarn deploy-token` deploys the actual token. To know which arguments to pass in (such as name, symbol, e.t.c.), see `tasks/token.js`
