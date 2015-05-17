'use strict';

const _ = require('lodash');

const resolve = require('./resolve');
const dependencies = require('./dependencies');

class Factory {
  constructor(schema){
    const attrs = _.clone(schema.attributes);
    const order = dependencies(attrs);
    const attributes = _.reduce(order, resolve, attrs);

    _.assign(this, attributes);
  }
}

module.exports = Factory;
