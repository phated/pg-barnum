'use strict';

//const _ = require('lodash');
var pgQuery = require('pg-query');
var connectionParameters = require('../../src/connectionParameters');
query.connectionParameters = connectionParameters;

function query(queryString, success, errCb) {
  var promise = pgQuery(queryString);

  function onSuccess(rows, result) {
    return success();
  }

  function onError(error) {
    return errCb();
  }
  promise.spread(onSuccess, onError);
}


module.exports = query;