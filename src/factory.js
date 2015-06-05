'use strict';

const _ = require('lodash');

const resolve = require('./resolve');
const populate = require('./populate');

class Factory {
  constructor(schema) {
    _.assign(this, schema);
  }

  _resolve(overrides = {}) {
    return _.merge({}, resolve(this.attributes), overrides, function(a, b){
      if(b && b.relation){
        return b.relation._resolve();
      }
      return b;
    });
  }

  _populate(overrides = {}, cb) {
    const name = this.name;
    const foreignKey = this.foreignKey;
    const tableName = this.tableName;
    return populate(tableName, this._resolve(overrides), cb)
      .then(function(result) {
        const row = result[0][0];
        const obj = {};
        obj.relationAttribute = {};
        obj.name = name;
        obj.relationAttribute[foreignKey] = row.id;
        obj.attributes = row;
        return obj;
      });
  }
}

module.exports = Factory;
