#!/bin/bash
set -e

echo "cleaning database ..."
flyway clean

echo "running flyway migrations ..."
flyway migrate
