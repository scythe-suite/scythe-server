#!/bin/bash -e

export REPO=scythe/stserver

. ../deps_get.sh
rm -f st sf wait-for
cp -f ../deps/{st,sf,wait-for} .

echo "Build image id:"
docker build -qt $REPO:$VERSION .
docker tag $REPO:$VERSION $REPO:$TAG

rm -f st sf wait-for
. ../deps_check.sh st sf
