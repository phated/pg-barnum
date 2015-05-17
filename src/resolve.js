'use strict';

const _ = require('lodash');

function normalizeNode(attribute, key, ctx){
  const base = {
    key: key,
    ctx: ctx
  };

  if(_.isPlainObject(attribute)){
    return _.assign({ value: attribute.default }, base);
  } else {
    return _.assign({ value: attribute }, base);
  }
}

function resolveFunctions({ value, ctx, key }){
  return {
    ctx: ctx,
    key: key,
    value: _.isFunction(value) ? value.call(ctx) : value
  };
}

function resolveTemplates({ ctx, value }){
  if(_.isString(value)){
    return _.template(value)(ctx);
  }

  return value;
}

const resolve = _.flow(normalizeNode, resolveFunctions, resolveTemplates);

module.exports = resolve;
