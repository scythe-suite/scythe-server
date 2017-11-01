FROM openjdk:8-jdk-alpine
MAINTAINER Massimo Santini "santini@di.unimi.it"
RUN apk add --no-cache --update python py-pip; \
    apk add --no-cache --virtual .build-deps \
        gcc \
        python-dev \
        musl-dev; \
        pip install eventlet; \
        apk del .build-deps
ENV PYTHONPATH=/bin/sf:/bin/st
ENTRYPOINT ["/bin/entrypoint.sh"]
COPY sf /bin
COPY st /bin
COPY wait-for /bin
COPY entrypoint.sh /bin
RUN chmod a+rx /bin/sf /bin/st /bin/wait-for /bin/entrypoint.sh
