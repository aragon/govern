#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

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
graph deploy $FULLNAME \
  --ipfs https://api.thegraph.com/ipfs/ \
  --node https://api.thegraph.com/deploy/ \
  --access-token $GRAPHKEY > deploy-output.txt

SUBGRAPH_ID=$(grep "Build completed:" deploy-output.txt | grep -oE "Qm[a-zA-Z0-9]{44}")
rm deploy-output.txt
echo "The Graph deployment complete: ${SUBGRAPH_ID}"

if [[ -z "$SUBGRAPH_ID" ]]; then
  echo "Could not find subgraph ID in deploy output, cannot deploy to Aragon infra."
  exit 1
else
  echo "Deploying subgraph ${SUBGRAPH_ID} to Aragon infra..."
  kubectl exec graph-shell-0 -- create $FULLNAME
  kubectl exec graph-shell-0 -- deploy $FULLNAME $SUBGRAPH_ID graph_index_node_0
  kubectl exec graph-shell-0 -- reassign $FULLNAME $SUBGRAPH_ID graph_index_node_0
fi
