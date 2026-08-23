#!/usr/bin/env bash

export SERVICE_MODE="local"
export FOODIO_DIST_DIR=".next-local"
export DATABASE_URL="postgresql://foodio:foodio-local-only@127.0.0.1:5433/foodio"
export REDIS_URL="redis://127.0.0.1:6380"
export SMTP_HOST="127.0.0.1"
export SMTP_PORT="1025"
export MAILTRAP_FROM_EMAIL="no-reply@foodio.test"

export JWT_SECRET="foodio-local-jwt-secret-do-not-use-in-production"
export EMAIL_VERIFICATION_SECRET="foodio-local-email-secret-do-not-use-in-production"
export RATE_LIMIT_SECRET="foodio-local-rate-limit-secret-do-not-use-in-production"
