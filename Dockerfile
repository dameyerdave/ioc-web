FROM ubuntu:latest
LABEL maintainer="dameyerdave@gmail.com"
RUN apt update
RUN apt install node npm -y
RUN mkdir -p /opt/iocweb
RUN git clone https://github.com/dameyerdave/ioc-web /opt/iocweb
USER root
WORKDIR /opt/iocweb
ENTRYPOINT npm start
