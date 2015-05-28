'use strict';

const query = require('pg-query');
query.connectionParameters = require('./connectionParameters');


function truncate(tableName, cb) {
  return query(`TRUNCATE books RESTART IDENTITY CASCADE`, cb);
}

module.exports = truncate;