#!/bin/bash

set -euo pipefail

"$(dirname "$0")"/npm-install-if-needed.sh

exec npm run lint "$@"
