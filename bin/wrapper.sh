#!/bin/bash

# Wrapper script to let a test pass on commits from before a specific
# test script was added.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ -x "$1" ]]
then
	exec "$@"
fi
