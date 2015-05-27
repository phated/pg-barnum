'use strict';

//const _ = require('lodash');
var pgQuery = require('pg-query');
var connectionParameters = require('../../src/connectionParameters');
pgQuery.connectionParameters = connectionParameters;

function query(queryString, success, errCb) {
  var promise = pgQuery(queryString);

  promise.done(success, errCb);

  return promise;
}


module.exports = query;