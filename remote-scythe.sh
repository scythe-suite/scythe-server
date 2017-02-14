#!/bin/bash

export TEACHER_ID="$1" # this is safe since it is in .ssh/authorized_keys
if [ -z "$TEACHER_ID" ]; then
    echo "scythe-remote: missing TEACHER_ID" >&2
    exit 1
fi

arguments=($SSH_ORIGINAL_COMMAND)
command="${arguments[0]}"
export EXAM_ID="${arguments[1]}"
if [ -z "$EXAM_ID" ]; then
    echo "scythe-remote: missing EXAM_ID" >&2
    exit 1
fi
export SCYTHE_ROOT="$HOME/scythe-root/$TEACHER_ID/$EXAM_ID"
mkdir -p "$SCYTHE_ROOT"
mkdir -p "$SCYTHE_ROOT/uploads"
if [ ! -r "$SCYTHE_ROOT/uploads/no.log" ]; then
    touch "$SCYTHE_ROOT/uploads/no.log" # to avoid tail failures
fi

echo "$SSH_ORIGINAL_COMMAND"  > /home/scythe/command

start() {
    local conf="$SCYTHE_ROOT/conf.py"
    local uploads="$SCYTHE_ROOT/uploads"
    local name="${TEACHER_ID}-${EXAM_ID}"
    local base_url="http://$(hostname)/tm/$TEACHER_ID/"

    if [ ! -r "$conf" ]; then
        echo "scythe-remote start: missing '$EXAM_ID' configuration for teacher '$TEACHER_ID'" >&2
        exit 1
    fi
    edconf=$(mktemp /tmp/output.XXXXXXXXXX) || { echo "scythe-remote start: failed to create temp file" >&2; exit 1; }
    sed 's/^UPLOAD_DIR\s*=.*/UPLOAD_DIR = "\/uploads"/' "$conf" | sed "1i BASE_URL = '$base_url'" > "$edconf"

    if docker ps -a --filter label=scythe=tm  | grep -q "$name"; then
        echo "scythe-remote start: killing old instance..." $(docker rm -f "$name") >&2
    fi
    did=$(docker run -l scythe=tm --name "$name" -d --network=scythe -v "$uploads":/uploads -v "$edconf":/app/conf.py:ro scythe/tm)
    echo "scythe-remote start: running container '$name' with conf '$conf', uploads in '$uploads' and base url '$base_url' (docker id '$did')..." 2>&1
}

case "$command" in
    push)
        cat > "$SCYTHE_ROOT/conf.py"
        echo "scythe-remote: installed '$EXAM_ID' configuration for teacher '$TEACHER_ID'" >&2
    ;;
    start)
        echo "scythe-remote: starting '$EXAM_ID' for teacher '$TEACHER_ID'" >&2
        start
    ;;
    stop)
        echo "scythe-remote: stopping '$EXAM_ID' for teacher '$TEACHER_ID'" >&2
        docker rm -f "${TEACHER_ID}-${EXAM_ID}"
    ;;
    status)
        echo "scythe-remote: running sessions for teacher '$TEACHER_ID'" >&2
        docker ps --filter label=scythe=tm | grep "${TEACHER_ID}"
    ;;
    get)
        rsync --server --sender -vlogDtprz . "$SCYTHE_ROOT/uploads"
    ;;
    logtail)
        echo "scythe-remote: tailing '$EXAM_ID' logs for teacher '$TEACHER_ID', hit ctrl-c to stop..." >&2
        tail -f "$SCYTHE_ROOT/uploads"/*.log
    ;;
    *)
        echo "scythe-remote: command '$command' not recognized" >&2
        exit 1
esac
