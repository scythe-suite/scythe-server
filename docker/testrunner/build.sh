#!/bin/bash -e

export REPO=scythe/testrunner

if [ ! -z "$1" ]; then
    . ../deps_build.sh
fi
. ../deps_get.sh
rm -f st sf wait-for
cp -f ../deps/{st,sf,wait-for} .

echo "Build image id:"
docker build -qt $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:$VERSION

rm -f st sf wait-for
. ../deps_check.sh
