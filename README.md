# lmrdashboard
Dashboard displaying various live information about the #linuxmasterrace IRC channel on irc.snoonet.org.  
Community effort, entirely FOSS.  
CI and deployment hosted on GitLab.  

## Development setup

### Containerless
Setup a `.env` file in the repo root with variables/values similar to those in the Containerfiles.
Example:
```
LMRD_DB_HOST=127.0.0.1
LMRD_DB_PORT=3306
LMRD_DB_NAME=lmrd
LMRD_DB_USER=<user>
LMRD_DB_PASS=<password>
LMRD_IRC_HOST=irc.snoonet.org
LMRD_IRC_PORT=6697
LMRD_IRC_CHANNEL=#linuxmasterrace
LMRD_IRC_USER=lmrdashboard
LMRD_IRC_PASS=<password or empty>
```
#### Database
Setup mariadb database, use SQL dump in `backend/irc/utils/db`:
```sh
mysql -u <user> -p lmrd < ~/git/lmrdashboard/backend/irc/utils/db/lmrdashboard.schema.sql
```
#### Frontend
```sh
cd frontend
yarn install
yarn dev
```
Visit `localhost:3000`.
#### Backend
```sh
cd backend
yarn install
tsc # optional
ts-node server.js
curl http://localhost:4000/test # optional
```

### Containers
#### Explicit containers
##### Frontend
```sh
cd frontend
docker build -f Containerfile -t lmrd/frontend .
docker run -d -p <port>:80 lmrd/frontend
```
Visit `localhost:<port>`.
##### Backend
```sh
cd backend
docker build -f Containerfile -t lmrd/backend .
docker run --env-file .env --network="host" lmrd/backend
# network=host optional, for when a local database is used
```

#### docker-compose
Instead of explicit containers, the `docker-compose.yml` file can be used.  
This also includes the database.
```sh
docker-compose up -d
docker-compose logs -f
docker-compose down
```
Visit `localhost:8080` for a database UI.