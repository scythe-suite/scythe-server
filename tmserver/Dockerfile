FROM python:2.7-alpine

MAINTAINER Massimo Santini "santini@di.unimi.it"

RUN pip install gunicorn

EXPOSE 8000

RUN mkdir /app

WORKDIR /app

ENV PYTHONPATH=/app/tm
ENV TM_SETTINGS=/app/conf.py

CMD [ "gunicorn", "--log-level", "INFO", "--error-logfile", "-", "-w", "4", "-b", "0.0.0.0:8000" ,"tm.web:app" ]

COPY tm /app/tm
RUN chown -R root:root /app && chmod -R a+rx /app
