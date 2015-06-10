'use strict';

const _ = require('lodash');

const resolve = require('./resolve');
const populate = require('./populate');

/**
 * Factory is a object constructor class that takes in a json schema and can output a complete object plus it's related objects if desired.
 */

class Factory {

  /**
   * @constructor
   * Optional params are resolved from the key to the schema if none are supplied.
   * @param {object} schema - The schema for the object.
   * @param {string} [schema.tableName] - The name of the table.
   * @param {object} [schema.foreignKey] - The object that contains factories and related foreign keys.
   */

  constructor(schema) {
    _.assign(this, schema);
  }

  _resolve(overrides = {}) {
    if (this.beforeBuild) {
      _.merge(overrides, this.beforeBuild());
    }
    let attributes = _.merge(resolve(this.attributes), overrides);
    if (this.afterBuild) {
      this.afterBuild(attributes);
    }
    return attributes;
  }

  _populate(overrides = {}) {
    const factory = this;
    const name = this.name;
    const foreignKey = this.foreignKey;
    const tableName = this.tableName;
    let attributes = this._resolve(overrides);
    if (this.beforeCreate) {
      this.beforeCreate(attributes);
    }
    return populate(tableName, attributes)
      .then(function(result) {
        const row = result[0][0];
        const obj = {};
        obj.relationAttribute = {};
        obj.name = name;
        obj.relationAttribute[foreignKey] = row.id;
        obj.attributes = row;
        if (factory.afterCreate) {
          factory.afterCreate(obj.attributes);
        }
        return obj;
      });
  }
}

module.exports = Factory;