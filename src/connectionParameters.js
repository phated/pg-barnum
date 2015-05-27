'use strict';

var assert = require('assert');

assert(process.env.DATABASE_URL, 'DATABASE_URL environment variable required');

var extend = require('util')._extend;

var parse = require('pg-connection-string').parse;

var connection = parse(process.env.DATABASE_URL);

var connectionParameters = extend({
  poolSize: 10,
  poolIdleTimeout: 1000,
  reapIntervalMillis: 1000,
  poolLog: false
}, connection);

module.exports = connectionParameters;
