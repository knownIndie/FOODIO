#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_directory="$(cd "${script_directory}/.." && pwd)"

cd "${project_directory}"
source "${script_directory}/local-env.sh"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install Docker Desktop before running pnpm local."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Starting Docker Desktop..."
  docker desktop start --timeout 120
fi

foodio_port="${FOODIO_PORT:-3000}"
if command -v lsof >/dev/null 2>&1 &&
  lsof -nP -iTCP:"${foodio_port}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${foodio_port} is already in use."
  echo "Stop the existing server or run FOODIO_PORT=3100 pnpm local."
  exit 1
fi

echo "Starting FoodIO local services..."
docker compose up -d --wait

echo "Applying database migrations..."
pnpm dbm

echo "Checking PostgreSQL, Redis, Mailpit, and the local adapters..."
pnpm exec tsx scripts/verify-local-services.ts

echo
echo "FoodIO: http://localhost:${foodio_port}"
echo "Mailpit: http://localhost:8025"
echo "PostgreSQL: 127.0.0.1:5433"
echo "Redis: 127.0.0.1:6380"
echo

exec pnpm exec next dev --hostname 0.0.0.0 --port "${foodio_port}"
