#!/bin/bash -e

export REPO=scythe/tmserver

. ../deps_get.sh
rm -f tm
cp -f ../deps/tm .

echo "Build image id:"
docker build -qt $REPO:$VERSION .
docker tag $REPO:$VERSION $REPO:$TAG

rm -f tm
. ../deps_check.sh tm
