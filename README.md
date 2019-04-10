# IOC Web API
## Run docker container
```bash
docker run --name iocweb --hostname iocweb -e MONGO_HOST=localhost -e MONGO_PORT=27017 -p 8080:8080 -d dmeyerdave/iocweb
