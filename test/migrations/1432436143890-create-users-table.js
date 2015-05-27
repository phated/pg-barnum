'use strict';

var query = require('./query');

var sqlUp = require('sql-load')('test/migrations/create/users');
var sqlDown = require('sql-load')('test/migrations/drop/users');

exports.up = function(success, error) {
  query(sqlUp, success);
};

exports.down = function(success, error) {
  query(sqlDown, success);
};
