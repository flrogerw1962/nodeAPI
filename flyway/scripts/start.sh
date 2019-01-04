#!/bin/bash
set -e

echo "waiting for database to start (required for local dev and testing) ..."
sleep 6

echo "running flyway migrations ..."
flyway migrate

# keep container alive
sleep infinity
