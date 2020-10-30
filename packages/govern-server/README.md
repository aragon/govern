# Govern Server

## How to query data

Govern Server is exposing a GraphQL API that lets you fetch data related to your Govern DAOs. Have a look at the [Govern Server API documentation](https://docs.aragon.org/govern/developers/server-api) for the list of types and queries you can use.

## Directory structure

```
# The core server library, which will be in a separate package later.
# We should keep in mind that this part will eventually run in the
# browser, enabling the fully decentralized mode of Aragon Govern.
/src/core

# API endpoints are prefixed by “api-”. We’ll only have a GraphQL API at first,
# and a REST API will be added later. Each API server exposes a single start()
# function with its configuration as a parameter.
/src/api-graphql
```

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
