#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_directory="$(cd "${script_directory}/.." && pwd)"

cd "${project_directory}"
source "${script_directory}/local-env.sh"

docker compose up -d --wait
pnpm dbm
pnpm exec tsx scripts/verify-local-services.ts --send-email
