FROM node:12.19.0-alpine
RUN apk add --no-cache git bash curl

WORKDIR /app

# copy all package json files
COPY ./package.json                                   /app/package.json
COPY ./packages/erc3k/package.json                    /app/packages/erc3k/package.json
COPY ./packages/govern/package.json                   /app/packages/govern/package.json
COPY ./packages/govern-console/package.json           /app/packages/govern-console/package.json
COPY ./packages/govern-contract-utils/package.json    /app/packages/govern-contract-utils/package.json
COPY ./packages/govern-core/package.json              /app/packages/govern-core/package.json
COPY ./packages/govern-create/package.json            /app/packages/govern-create/package.json
COPY ./packages/govern-discord/package.json           /app/packages/govern-discord/package.json
COPY ./packages/govern-server/package.json            /app/packages/govern-server/package.json
COPY ./packages/govern-subgraph/package.json          /app/packages/govern-subgraph/package.json
COPY ./packages/govern-token/package.json             /app/packages/govern-token/package.json

# install dependencies
COPY ./yarn.lock                                      /app/yarn.lock
RUN yarn install --frozen-lockfile

# try building the app
COPY . .
RUN yarn build:contracts

CMD echo specify one of the package.json scripts in command line
