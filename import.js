#!/usr/bin/env node

const H = require('highland')
const pg = require('pg')
const shapefile = require('shapefile')

const BATCH_SIZE = 250

const client = new pg.Client({
  user: 'postgis',
  host: 'localhost',
  database: 'postgis',
  password: 'postgis',
  port: 5432
})

async function insert (client, features) {
  const value = (feature) => `(
    '${feature.properties.BU_CODE}',
    '${JSON.stringify(feature.properties).replace(/'/g, '\'\'')}'::jsonb,
    ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(feature.geometry)}'), 28992), 3857)
  )`

  const query = `
    INSERT INTO bovenland.cbs (buurt_id, data, geometry)
    VALUES ${features.map(value).join(',')}`

  await client.query(query)
}

async function run () {
  await client.connect()
  await client.query('TRUNCATE bovenland.cbs')

  const filename = './data/buurt_2018_v2.shp'
  const source = await shapefile.read(filename)

  H(source.features)
    .batch(BATCH_SIZE)
    .flatMap((batch) => H(insert(client, batch)))
    .done(async () => {
      await client.end()
      console.log('Done...')
    })
}

run()
