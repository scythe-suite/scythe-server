#!/bin/sh

if [ -z "$SCYTHE_REDIS_HOST" ]; then
    SCYTHE_REDIS_HOST=localhost
fi

if [ "$1" == "gunicorn" ]; then
    /bin/wait-for "$SCYTHE_REDIS_HOST":6379 -- "$@"
else
    /bin/wait-for "$SCYTHE_REDIS_HOST":6379 -- /bin/st "$@"
fi
