#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_directory="$(cd "${script_directory}/.." && pwd)"

cd "${project_directory}"
source "${script_directory}/local-env.sh"

docker compose up -d --wait postgres
pnpm dbm
pnpm exec tsx lib/db/seed.ts
