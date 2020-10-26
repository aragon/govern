#!/usr/bin/env bash

# --------------------------------------------------------------------
# Prepares package folder
# --------------------------------------------------------------------

# Creates temporary package folder
rm -r ./package
mkdir package

# Copy internal files to package
cp -r ./internal ./package/

# Copy public files to package
cp -r ./public/* ./package/

# Copy `package.json` to package
cp ./package.json ./package/package.json

# Copy `README.md` to package
cp ./README.md ./package/README.md

# Copy `tsconfig.prod.json`
cp ./tsconfig.prod.json ./package/

# Go to package directory
cd ./package

# Build package
yarn build:prod

# Remove not required files
rm ./*.ts
rm -r ./internal/*
rm ./tsconfig.prod.json

# Move `dist` files to root folder and delete the `dist` folder
mv ./dist/package/* ./

rm -r ./dist

echo -e "\033[0;32mPackage successfully prepared!\033[0m"
