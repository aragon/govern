#!/bin/sh
SOURCE="$1"
TARGET="$2"
docker pull $SOURCE
docker tag $SOURCE $TARGET
docker push $TARGET
