FROM alpine:3.6
LABEL maintainer="Massimo Santini santini@di.unimi.it"
RUN	apk add --no-cache redis
RUN mkdir /data && chown redis:redis /data
VOLUME /data
WORKDIR /data
EXPOSE 6379
CMD ["redis-server", "--appendonly", "yes", "--protected-mode", "no"]
