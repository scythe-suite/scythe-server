#!/bin/bash -e

. ../deps_get.sh
rm -f st sf wait-for
cp -f ../deps/{st,sf,wait-for} .

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../../scythe-server  | cut -d "=" -f2)
export OWNER=scythe-suite
export REPO=scythe-server
export IMAGE=stserver

echo "Build image id:"
docker build -qt $REPO/$IMAGE:$VERSION .
docker tag $REPO/$IMAGE:$VERSION $REPO/$IMAGE:latest
docker tag $REPO/$IMAGE:$VERSION docker.pkg.github.com/$OWNER/$REPO/$IMAGE:$VERSION

rm -f st sf wait-for
. ../deps_check.sh st sf
