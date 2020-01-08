#!/bin/bash -e

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export OWNER=scythe-suite
export REPO=scythe-server
export IMAGE=router

echo "Build image id:"
docker build -qt $REPO/$IMAGE:$VERSION .
docker tag $REPO/$IMAGE:$VERSION $REPO/$IMAGE:latest
docker tag $REPO/$IMAGE:$VERSION docker.pkg.github.com/$OWNER/$REPO/$IMAGE:$VERSION
docker tag $REPO/$IMAGE:$VERSION docker.pkg.github.com/$OWNER/$REPO/$IMAGE:latest