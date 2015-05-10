'use strict';

const Factory = require('./factory');

function schema(opts){
  return new Factory(opts);
}

function populate({ schemas, connection }, cb){
  // TODO: normalize schemas
  // TODO: use connection to insert data

  // TODO: support promises and callbacks
  cb(null, 1);
}

module.exports = { populate, schema };
