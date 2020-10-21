# Govern Server

```
# Directory structure:

# The codebase
/src

# The core server library, which will probably be moved to an independent
# at some point. We should keep in mind that this part will eventually run in
# the browser, enabling the fully decentralized mode of Aragon Govern.
/src/core

# API endpoints are prefixed by “api-”. We’ll only have a GraphQL API at first,
# and a REST API will be added later. Each API server exposes a single start()
# function with its configuration as a parameter.
/src/api-graphql
```

## Docker container

Build a docker container and expose server on http://localhost:3000:
```
docker build . -t govern-server
docker run -it --rm -d -p 3000:3000 --name govern-server govern-server
```

Remove the container:
``` 
docker stop govern-server
```

## CI/CD

Github Actions workflow `server-ci-cd.yml` builds and deploys a server container when creating `v*` tags in the `master` branch.

Deployments can be triggered using lerna:
```bash
yarn lerna version [ major | minor | patch ]
```
