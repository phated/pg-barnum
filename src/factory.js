'use strict';

const _ = require('lodash');

const resolve = require('./resolve');
const dependencies = require('./dependencies');

function reducer(result, propertyKey){
  const attribute = result[propertyKey];
  result[propertyKey] = resolve(attribute, propertyKey, result);
  return result;
}

class Factory {
  constructor(schema){
    const attrs = _.clone(schema.attributes);
    const order = dependencies(attrs);
    const attributes = _.reduce(order, reducer, attrs);

    _.assign(this, attributes);
  }
}

module.exports = Factory;
