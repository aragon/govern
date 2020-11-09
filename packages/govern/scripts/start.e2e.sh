#!/usr/bin/env bash

# Go to govern server package and start dev server
cd ../govern-server/
nohup yarn dev >>/dev/null 2>>/dev/null &

# Check if the govern-server is running
while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:3000/.well-known/apollo/server-health)" != "200" ]]; do sleep 5; done

# Go to govern package and start e2e tests
cd ../govern
yarn build
jest -c ./jest.config.e2e.js
