FROM openjdk:8-jdk-alpine
MAINTAINER Massimo Santini "santini@di.unimi.it"
RUN apk add --no-cache --update python
COPY sf /bin
COPY st /bin
COPY wait-for /bin
COPY entrypoint.sh /bin
RUN chmod a+rx /bin/sf /bin/st /bin/wait-for /bin/entrypoint.sh
ENV PYTHONPATH=/bin/sf:/bin/st
ENTRYPOINT ["/bin/entrypoint.sh"]
