# Govern Server

## How to query data

Govern Server is exposing a GraphQL API that lets you fetch data related to your Govern DAOs. Have a look at the [Govern Server API documentation](https://docs.aragon.org/govern/developers/server-api) for the list of types and queries you can use.

## Environment variables

Govern Server reads a number of variables from the environment:

- `GVN_CHAIN_ID`: the network Chain ID.
- `GVN_ENS_ADDRESS`: the ENS address.
- `GVN_NETWORK_NAME`: the network name.
- `GVN_GRAPHQL_HTTP_PORT`: the GraphQL HTTP port to expose.
- `GVN_SUBGRAPH_URL`: the subgraph URL to fetch data from.

## Docker container

Build a docker container and expose server on http://localhost:3000:

```console
docker build . -t govern-server
docker run -it --rm -d -p 3000:3000 --name govern-server govern-server
```

Remove the container:

```console
docker stop govern-server
```

## CI/CD

Github Actions workflow `server-ci-cd.yml` builds and deploys a server container when creating `v*` tags in the `master` branch.

Deployments can be triggered using lerna:

```console
yarn lerna version [ major | minor | patch ]
```
