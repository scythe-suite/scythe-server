FROM python:3-alpine
LABEL maintainer="Massimo Santini santini@di.unimi.it"
RUN apk add --no-cache --update python3 py-pip gcc musl-dev; \
        apk add --no-cache --virtual .build-deps python3-dev; \
        pip install eventlet; \
        apk del .build-deps
EXPOSE 8000
RUN mkdir /app
WORKDIR /app
ENV PYTHONPATH=/bin/tm
ENV TM_SETTINGS=/app/conf.py
CMD [ "/bin/tm", "web" ]
COPY tm /bin/tm
RUN chmod -R a+rx /bin/tm && chmod -R a+rx /app
