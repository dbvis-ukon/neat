# VAST Challenge Grand Challenge 2019 Prototype

## Development

For development you need to have docker installed.
Afterward, simply execute `docker-compose up` in the root of this folder.
This will spin up two development environments and a database.
My recommended IDE is [VSCode](https://code.visualstudio.com/).
  
Before the first run you have to do an `npm install` for server and client
to create the `node_modules`-folder in the mounted volumes:

```
docker-compose run server npm install
docker-compose run client npm install
```


### Server

The server is written in typescript and runs on node.
Execute `docker-compose run server npm install` to install all dependencies for the server. You need to do this everytime the package.json is updated.
It is accessible on port `3000`. Check http://localhost:3000/health ; it should return `OK`.
When changing a file in the server code the server will restart automatically.

### Client

The client is written in typescript using the Angular 7 framework.
Execute `docker-compose run client npm install` to install all dependencies for the server. You need to do this everytime the package.json is updated.
The dev-server for the client is accessible via http://localhost:4200
When changing a file in the client code the dev-server will restart automatically.

### RethinkDB

The database to exchange data between the clients is RethinkDB because it allows observing for changes in a specific table.
RethinkDB provides an admin interface on http://localhost:8080
