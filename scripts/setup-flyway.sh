#!/usr/bin/env bash
set -u

# Base Environment Variables
FLYWAY_HOME=/home/ubuntu/flyway
FLYWAY_TARBALL=https://bintray.com/artifact/download/business/maven/flyway-commandline-3.2.1-linux-x64.tar.gz

echo "installing flyway ..."

mkdir ${FLYWAY_HOME} && \
curl -L ${FLYWAY_TARBALL} | tar --strip-components=1 -xz -C ${FLYWAY_HOME}

# copy dev configuration and run flyway migrations
cp ./flyway/conf/stg/flyway.conf /home/ubuntu/flyway/conf/flyway.conf
cp -rf ./flyway/sql/ /home/ubuntu/flyway/sql/

/home/ubuntu/flyway/flyway info
