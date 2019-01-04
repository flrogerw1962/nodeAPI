# Base image using jyore/fedora:23 (https://hub.docker.com/r/jyore/fedora)
FROM jyore/fedora:23

# Base Environment Variables
ENV FLYWAY_HOME /flyway
ENV FLYWAY_TARBALL https://bintray.com/artifact/download/business/maven/flyway-commandline-3.2.1-linux-x64.tar.gz

# Install the Software
RUN dnf update -y && \
    dnf install -y tar && \
    mkdir ${FLYWAY_HOME} && \
    curl -L ${FLYWAY_TARBALL} | tar --strip-components=1 -xz -C ${FLYWAY_HOME}

RUN ln -s /flyway/flyway /usr/local/bin/flyway

# Prepare Data Volumes
RUN rm -rf ${FLYWAY_HOME}/conf/* ${FLYWAY_HOME}/sql/* ${FLYWAY_HOME}/jars/*
VOLUME ${FLYWAY_HOME}/conf ${FLYWAY_HOME}/sql ${FLYWAY_HOME}/jars

ADD scripts/start.sh /start.sh
ADD scripts/clean.sh /clean.sh

# Workdirectory and Entrypoint
WORKDIR ${FLYWAY_HOME}
ENTRYPOINT ["/start.sh"]
