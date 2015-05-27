'use strict';

const _ = require('lodash');

const resolve = require('./resolve');
const populate = require('./populate');
const sql = require('sql-bricks-postgres');

class Factory {
  constructor(schema) {
    _.assign(this, schema);
  }

  _resolve(overrides = {}) {
    return _.merge(resolve(this.attributes), overrides);
  }

  _populate(overrides = {}, cb) {
    let name = this.name;
    let foreignKey = this.foreignKey;
    let tableName = this.tableName;
    return populate(tableName, _.merge(resolve(this.attributes), overrides), cb)
      .then(function(result) {
        let row = result[0][0];
        let obj = {};
        obj.relationAttribute = {};
        obj.name = name;
        obj.relationAttribute[foreignKey] = sql(`currval('${tableName}_id_seq')`);
        obj.attributes = row;
        return obj;
      });
  }
}

module.exports = Factory;