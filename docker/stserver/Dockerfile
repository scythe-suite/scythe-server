FROM openjdk:12-jdk-alpine
LABEL maintainer="Massimo Santini santini@di.unimi.it"
RUN apk add --no-cache --update python3 gcc musl-dev; \
    apk add --no-cache --virtual .build-deps python3-dev; \
    pip3 install eventlet; \
    apk del .build-deps
ENV PYTHONPATH=/bin/sf:/bin/st
ENTRYPOINT ["/bin/entrypoint.sh"]
COPY sf /bin
COPY st /bin
COPY wait-for /bin
COPY entrypoint.sh /bin
RUN chmod a+rx /bin/sf /bin/st /bin/wait-for /bin/entrypoint.sh
