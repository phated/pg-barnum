'use strict';

const _ = require('lodash');


function recursiveResolve(attributes) {
  let resolved = [];
  let result = {};
  while (resolved.length !== _.keys(attributes).length) {
    _.mapValues(attributes, (attr, key, ctx) => {
      if (_.includes(resolved, key)) {
        return;
      }
      if (attr.deps === undefined) {
        result[key] = _.result(ctx, key);
        resolved.push(key);
        return;
      }
      if (_.includes(resolved, ...attr.deps)) {
        if (_.isString(attr.value)) {
          result[key] = _.template(attr.value)(result);
        }
        else {
          result[key] = _.get(ctx, [key, 'value']).apply(result);
        }
        resolved.push(key);
      }
    });
  }
  return result;
}

const resolve = _.flow(recursiveResolve);

module.exports = resolve;