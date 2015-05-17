'use strict';

const _ = require('lodash');

function normalizeNode(attribute, ctx){
  const base = {
    ctx: ctx
  };

  if(_.isPlainObject(attribute)){
    return _.assign({ value: attribute.default }, base);
  } else {
    return _.assign({ value: attribute }, base);
  }
}

function resolveFunctions({ value, ctx }){
  return {
    ctx: ctx,
    value: _.isFunction(value) ? value.call(ctx) : value
  };
}

function resolveTemplates({ value, ctx }){
  if(_.isString(value)){
    return _.template(value)(ctx);
  }

  return value;
}

const resolvers = _.flow(normalizeNode, resolveFunctions, resolveTemplates);

function resolve(result, propertyKey){
  const attribute = result[propertyKey];
  result[propertyKey] = resolvers(attribute, result);
  return result;
}

module.exports = resolve;
