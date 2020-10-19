#!/usr/bin/env bash

# COLOR
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# -----------------------------------
# Compile contracts and extract ABIs
# -----------------------------------

cd ./packages/govern-core/
npm run compile
npm run abi:extract

if [ $? -ne 0 ]
then
    echo " "
    echo -e "${RED}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                                 **"
    echo "**            Not able to compile the contracts and extract the ABIs!              **"
    echo "**                                                                                 **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

    exit 1
else
    echo " "
    echo -e "${GREEN}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                    Contracts compiled and ABIs extracted                     **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"
fi

# ----------------------------------
# Init docker containers
# ----------------------------------

cd ../govern-server/
npm run start:containers

if [ $? -ne 0 ]
then
    echo " "
    echo -e "${RED}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                             **"
    echo "**                  Couldn't start all containers successfully                 **"
    echo "**                                                                             **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

    exit 1
fi

# --------------------------------------------
# Wait some seconds until containers are ready
# --------------------------------------------
echo "Waiting until containers are ready..."
sleep 35

echo " "
echo -e "${GREEN}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
echo "**                                                                              **"
echo "**                    All containers started successfully                       **"
echo "**                                                                              **"
echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

# ---------------------
# Create local subgraph
# ---------------------

cd ../govern-subgraph/
npm run create-local

if [ $? -ne 0 ]
then
    echo " "
    echo -e "${RED}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                     Couldn't create the subgraph locally                     **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

    exit 1
else
    echo " "
    echo -e "${GREEN}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                            Subgraph created locally                          **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"
fi

# -----------------------
# Deploy subgraph locally
# -----------------------
npm run deploy-local

if [ $? -ne 0 ]
then
    echo " "
    echo -e "${RED}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                     Couldn't deploy the subgraph locally                     **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"

    exit 1
else
    echo " "
    echo -e "${GREEN}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
    echo "**                                                                              **"
    echo "**                    Govern: local dev env initialized                         **"
    echo "**                                                                              **"
    echo "**      Execute from now on just 'npm run start:dev' in the root folder or      **"
    echo "**           'npm run start:containers' in the 'govern-server' package.         **"
    echo "**                                                                              **"
    echo -e ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${NC}"
fi
