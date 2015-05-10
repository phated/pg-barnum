'use strict';

const _ = require('lodash');

function resolveFunctions(attributes){
  return _.mapValues(attributes, (attr, key, ctx) => _.result(ctx, key));
}

function resolveTemplates(attributes){
  return _.mapValues(attributes, (attr, key, ctx) => {
    if(_.isString(attr)){
      return _.template(attr)(ctx);
    }

    return attr;
  });
}

const resolve = _.flow(resolveFunctions, resolveTemplates);

module.exports = resolve;
