
FROM node:lts

RUN mkdir /app

WORKDIR /app

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update

RUN apt-get install -y vim

RUN apt-get install -y man

RUN apt-get install -y locales

RUN locale-gen en_US.UTF-8

COPY . /app

RUN npm i