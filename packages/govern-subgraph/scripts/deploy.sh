#!/bin/bash

# Arguments
USER=$1
NAME=$2
NETWORK=$3

# Build manifest
echo ''
echo '> Building manifest file subgraph.yaml'
./scripts/build-manifest.sh $NETWORK

# Generate types
echo ''
echo '> Generating types'
graph codegen

# Prepare subgraph name
FULLNAME=$USER/aragon-$NAME-$NETWORK
if [ "$STAGING" ]; then
  FULLNAME=$FULLNAME-staging
fi
echo ''
echo '> Deploying subgraph: '$FULLNAME

# Deploy subgraph
if [ "$LOCAL" ]; then
    graph deploy $FULLNAME \
        --ipfs http://localhost:5001 \
        --node http://localhost:8020 \
        --access-token $GRAPHKEY
else
    graph deploy $FULLNAME \
        --ipfs https://api.thegraph.com/ipfs/ \
        --node https://api.thegraph.com/deploy/ \
        --access-token $GRAPHKEY
fi
