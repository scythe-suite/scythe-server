#!/bin/bash -e

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export REPO=scythe/viewer
export TAG='latest'

. ../deps_get.sh
rm -rf html
mkdir -p html
tar -C html -xvf ../deps/site.tgz

echo "Build image id:"
docker build -qt $REPO:$VERSION .
docker tag $REPO:$VERSION $REPO:$TAG
