# IOC Web API
## Requirements
1. Create a network to attach mongodb and iocweb to
```bash
docker network create --subnet=172.30.0.0/16 ioc
```
2. Install a mongodb docker.
```bash
docker run --name mongo --hostname mongo -p 27017 --net ioc -it -d mongo:3
```
3. Find out the ip of the mongo db
```bash
dtip mongo
```
## Run the iocweb docker container
```bash
docker run --name iocweb --hostname iocweb -e MONGO_HOST=<ip> -e MONGO_PORT=27017 -e TIMEZONE=2 -p 3080 -it -d dmeyerdave/iocweb
```
### Example
```bash
docker run --name iocweb --hostname iocweb -e MONGO_HOST=172.30.0.5 -e MONGO_PORT=27017 -e TIMEZONE=2 -p 1380:3080 -it -d dameyerdave/iocweb
```
