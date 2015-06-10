'use strict';

var query = require('./query');

var sqlUp = require('sql-load')('test/migrations/create/authors');
var sqlDown = require('sql-load')('test/migrations/drop/authors');

exports.up = function(success, error) {
  query(sqlUp, success, error);
};

exports.down = function(success, error) {
  query(sqlDown, success, error);
};
