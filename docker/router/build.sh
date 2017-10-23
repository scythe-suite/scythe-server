#!/bin/bash -e

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export REPO=scythe/router
export TAG='latest'

echo "Build image id:"
docker build -qt $REPO:$VERSION .
docker tag $REPO:$VERSION $REPO:$TAG
