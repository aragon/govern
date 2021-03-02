#!/bin/sh
set -e # exit on error
DOCKERFILE_PATH="$1"
REPO="$2"
GITHUB_SHA="$3"
# use previously built image for cache if possible
docker pull $REPO:latest || true
docker pull $REPO:rolling || true
docker build $DOCKERFILE_PATH -t $REPO:${GITHUB_SHA} -t $REPO:rolling --cache-from $REPO:rolling --cache-from $REPO:latest
docker push $REPO:${GITHUB_SHA}
docker push $REPO:rolling
