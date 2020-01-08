#!/bin/bash -e

. ../deps_get.sh
rm -rf html
mkdir -p html
tar -C html -xvf ../deps/site.tgz

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export OWNER=scythe-suite
export REPO=scythe-server
export IMAGE=viewer

echo "Build image id:"
docker build -qt $REPO/$IMAGE:$VERSION .
docker tag $REPO/$IMAGE:$VERSION $REPO/$IMAGE:latest
docker tag $REPO/$IMAGE:$VERSION docker.pkg.github.com/$OWNER/$REPO/$IMAGE:$VERSION
docker tag $REPO/$IMAGE:$VERSION docker.pkg.github.com/$OWNER/$REPO/$IMAGE:latest
