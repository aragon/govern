#!/usr/bin/env bash

# --------------------------------------------------------------------
# Publish package
# --------------------------------------------------------------------

# Prepare package
yarn publish:prepare

# Publish
cd ./package
yarn publish
