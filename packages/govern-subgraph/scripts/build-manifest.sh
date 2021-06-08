#!/bin/bash

NETWORK=$1

if [ "$STAGING" ]
then
  FILE=$NETWORK'-staging.json'
else
  FILE=$NETWORK'.json'
fi

DATA=manifest/data/$FILE

GOVERN_CORE_MODULE=$(node -e 'console.log(require("path").dirname(require.resolve("@aragon/govern-core/package.json")))')
GOVERN_CONTRACT_UTILS_MODULE=$(node -e 'console.log(require("path").dirname(require.resolve("@aragon/govern-contract-utils/package.json")))')

echo 'Generating manifest from data file: '$DATA
cat $DATA

mustache \
  -p manifest/templates/sources/GovernRegistry.yaml \
  -p manifest/templates/contracts/GovernRegistry.template.yaml \
  $DATA \
  subgraph.template.yaml \
  | sed -e "s#\$GOVERN_CORE_MODULE#$GOVERN_CORE_MODULE#g" \
  | sed -e "s#\$GOVERN_CONTRACT_UTILS_MODULE#$GOVERN_CONTRACT_UTILS_MODULE#g" \
  > subgraph.yaml
