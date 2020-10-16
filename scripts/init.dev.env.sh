#!/usr/bin/env bash

# Compile contracts and extract ABIs
cd ./packages/govern-core/
npm run compile
npm run abi:extract

# Init docker containers
cd ../govern-server/
npm run start:containers

# Create local subgraph
cd ../govern-subgraph/
npm run create-local

# Deploy subgraph locally
npm run deploy-local

echo " "
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "**                                                                              **"
echo "**                    Govern: local dev env initialized                         **"
echo "**                                                                              **"
echo "**      Execute from now on just 'npm run start:dev' in the root folder or      **"
echo "**           'npm run start:containers' in the 'govern-server' package.         **"
echo "**                                                                              **"
echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
