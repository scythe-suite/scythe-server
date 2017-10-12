#!/bin/bash -e

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export REPO=scythe/router
export TAG='latest'
export COMMIT=$(git rev-parse HEAD | cut -b -8)

docker build -t $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:$VERSION
