#!/bin/sh
DEPLOYMENT="$1"
IMAGE="$2"
# replace deployment image
kubectl set image deployment/$DEPLOYMENT app=$IMAGE
