'use strict';

const _ = require('lodash');

const resolve = require('./resolve');

class Factory {
  constructor(schema){
    const attributes = resolve(schema.attributes);

    _.assign(this, attributes);
  }
}

module.exports = Factory;
