#!/bin/sh

if [ -z "$SCYTHE_REDIS_HOST" ]; then
    SCYTHE_REDIS_HOST=localhost
fi

/bin/wait-for "$SCYTHE_REDIS_HOST":6379 -- /bin/st "$@"
