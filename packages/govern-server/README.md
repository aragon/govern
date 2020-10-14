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
