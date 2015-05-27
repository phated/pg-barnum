'use strict';

var query = require('./query');

var sqlUp = require('sql-load')('test/migrations/create/addresses');
var sqlDown = require('sql-load')('test/migrations/drop/addresses');

exports.up = function(success, error) {
  query(sqlUp, success, error);
};

exports.down = function(success, error) {
  query(sqlDown, success, error);
};
