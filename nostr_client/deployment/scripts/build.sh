#!/bin/bash

current_path="$(realpath $(dirname $0))"

echo "==== >> Going to $current_path"
cd ${current_path}

docker build -t cyphernode/nostr_client:0.1 -f ../docker/Dockerfile ../..
