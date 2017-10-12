#!/bin/bash -e

export VERSION=$(grep SCYTHE_SERVER_VERSION= ../scythe-server  | cut -d "=" -f2)
export REPO=scythe/tmserver
export TAG='latest'
export COMMIT=$(git rev-parse HEAD | cut -b -8)

last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/tristo-mietitore/releases/latest")
TRISTO_MIETITORE_VERSION="${last_release_url##*/}"

if [ ! -r tm ]; then
    curl -sLO "https://github.com/scythe-suite/tristo-mietitore/releases/download/$TRISTO_MIETITORE_VERSION/tm"
fi

docker build -t $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:$VERSION

rm -f tm

echo "tm tool: $(docker run -t --rm scythe/tmserver /app/tm version)"
