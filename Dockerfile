FROM ubuntu:latest
LABEL maintainer="dameyerdave@gmail.com"
RUN apt update
RUN apt install vim git nodejs npm -y
RUN mkdir -p /opt/iocweb
RUN git clone https://github.com/dameyerdave/ioc-web /opt/iocweb
RUN cd /opt/iocweb; /usr/bin/npm i
ENV MONGO_HOST localhost
ENV MONGO_PORT 27017
EXPOSE 3080
USER root
WORKDIR /opt/iocweb
ENTRYPOINT /usr/bin/npm start
