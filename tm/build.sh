#!/bin/bash

last_release_url=$(curl -sLo /dev/null -w '%{url_effective}' "https://github.com/scythe-suite/tristo-mietitore/releases/latest")
TRISTO_MIETITORE_VERSION="${last_release_url##*/}"
echo -e "building with tristo-mietitore version: $TRISTO_MIETITORE_VERSION\n" 2>&1

docker build --build-arg userid="$(id -u)" --build-arg version="$TRISTO_MIETITORE_VERSION" -t scythe/tm .
