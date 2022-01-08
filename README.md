# @bovenland/cbs

Imports CBS data into PostgreSQL.

Prerequisites:

Expects a PostgreSQL database `postgis` with the PostGIS extension running on localhost:5432, accessible with the following credentials:

  - user: `postgis`
  - password: `postgis`
  - host: `localhost`
  - database: `postgis`
  - port: `5432`

Usage:

    npm install
    ./import.js