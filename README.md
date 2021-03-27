<p align="center">
  <a href="https://dash.linuxmasterrace.org/" alt="">
    <img src="https://raw.githubusercontent.com/r-lmr/lmrdashboard/lmrdashboard/resources/lmrdlogo.svg"/>
  </a>
</p>
<p align="center">
  <a href="https://dash.linuxmasterrace.org/" alt="Pipelines">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fdash.linuxmasterrace.org%2F"/>
  </a>
  <a href="https://gitlab.com/cocainefarm/lmrdashboard/-/pipelines" alt="Pipelines">
    <img src="https://gitlab.com/cocainefarm/lmrdashboard/badges/lmrdashboard/pipeline.svg"/>
  </a>
  <a href="https://github.com/r-lmr/lmrdashboard/blob/lmrdashboard/LICENSE" alt="License">
    <img src="https://img.shields.io/github/license/r-lmr/lmrdashboard"/>
  </a>
  <a href="https://github.com/r-lmr/lmrdashboard/releases" alt="Release">
    <img src="https://img.shields.io/github/v/tag/r-lmr/lmrdashboard"/>
  </a>
</p>

Dashboard displaying various live information about the #linuxmasterrace IRC channel on irc.snoonet.org. Community effort, entirely FOSS.  

## Releasing

The master branch gets continuously deployed to a staging environment at [dash-stage.linuxmasterrace.org](https://dash-stage.linuxmasterrace.org/).
To deploy to the production environment, release a new version by bumping all version tags and tagging the release. This should be done using the `bash2version` script in the project root.

```sh
./bash2version --bump <major|minor|patch> --commit
```

Changes should be grouped into releases to prevent constant rejoining of the bot into the channel on each release.

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
LMRD_IRC_CHANNEL=#aboftytest
LMRD_IRC_USER=<testusernick>
LMRD_IRC_PASS=<password>
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
ts-node server.ts
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

## CI

The dashboard is deployed on a kubernetes cluster using `helmfile`.

Two environments, staging and production, are defined. The Staging environment does not join `#linuxmasterrace` but joins the `#aboftytest` channel.

Secrets for irc and mariadb users are injected using sops encrypted files in `./secrets`. To add a new person to access them add a key to [./sops.yaml](./sops.yaml) and run

```sh
sops updatekeys secrets/irc_user.yaml
sops updatekeys secrets/mariadb.yaml
```
