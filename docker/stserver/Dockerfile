FROM openjdk:8-jdk-alpine
MAINTAINER Massimo Santini "santini@di.unimi.it"
RUN apk add --no-cache --update python py-pip libevent
RUN apk add --no-cache --virtual .build-deps \
        coreutils \
        gcc \
        linux-headers \
        bsd-compat-headers \
        make \
        python-dev \
        musl-dev \
        libevent-dev; \
        pip install gunicorn gevent; \
        apk del .build-deps
ENV PYTHONPATH=/bin/sf:/bin/st
ENTRYPOINT ["/bin/entrypoint.sh"]
CMD [ "gunicorn", "--access-logfile", "-", "--log-level", "INFO", "--error-logfile", "-", "-k", "gevent", "-w", "4", "-b", "0.0.0.0:8000", "st.web:app" ]
COPY sf /bin
COPY st /bin
COPY wait-for /bin
COPY entrypoint.sh /bin
RUN chmod a+rx /bin/sf /bin/st /bin/wait-for /bin/entrypoint.sh
