'use strict';

const query = require('pg-query');
const sql = require('sql-bricks-postgres');
query.connectionParameters = require('./connectionParameters');


function populate(tableName, props, cb) {
  return query(
    sql.insert(tableName, props).returning('*').toString());
}

module.exports = populate;