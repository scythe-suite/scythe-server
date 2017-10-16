#!/bin/bash -e

export REPO=scythe/tmserver

. ../deps_get.sh
rm -f tm
cp -f ../deps/tm .

echo "Build image id:"
docker build -qt $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:$VERSION

rm -f tm
. ../deps_check.sh tm
