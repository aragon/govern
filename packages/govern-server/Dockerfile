FROM node:15-alpine

WORKDIR /govern

# Copy package.json and yarn.lock files

COPY ./packages/govern-server/package.json ./packages/govern-server/package.json
COPY ./packages/govern-lib/package.json ./packages/govern-lib/package.json
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

# Install dependencies

RUN yarn install --pure-lockfile --non-interactive --cache-folder ./yc; rm -rf ./yc

WORKDIR /govern/packages/govern-lib
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./yc; rm -rf ./yc

WORKDIR /govern/packages/govern-server
RUN yarn install --pure-lockfile --non-interactive --cache-folder ./yc; rm -rf ./yc

# Copy and build govern-lib

WORKDIR /govern/packages/govern-lib
COPY ./packages/govern-lib .
RUN yarn build

# Copy and run govern-server

WORKDIR /govern/packages/govern-server
COPY ./packages/govern-server .
CMD yarn start:server
