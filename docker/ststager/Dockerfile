FROM python:2.7-alpine
MAINTAINER Massimo Santini "santini@di.unimi.it"
COPY sf /bin
COPY st /bin
COPY wait-for /bin
RUN chmod a+rx /bin/sf /bin/st /bin/wait-for
ENV PYTHONPATH=/bin/sf:/bin/st
CMD [ "sh", "-c", "/bin/wait-for $SCYTHE_REDIS_HOST:6379 -- /bin/st stage -H /uploads -s $SCYTHE_SESSION_ID" ]
