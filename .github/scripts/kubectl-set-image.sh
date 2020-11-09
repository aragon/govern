#!/bin/sh
set -e # exit on error
DEPLOYMENT="$1"
IMAGE="$2"
# replace deployment image
kubectl set image deployment/$DEPLOYMENT app=$IMAGE
