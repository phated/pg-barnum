'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const Factory = require('./factory');
const when = require('when');

const ringMaster = {
  acts: {},
  assign: assign,
  rehearse: rehearse,
  preform: preform
};

function assign(factories = {}) {
  _.mapValues(factories, (factory, key, ctx) => {
    factory.name = factory.name || key;
    let name = factory.name;
    factory.foreignKey = factory.foreignKey || pluralize.singular(_.snakeCase(name) + '_id');
    factory.tableName = factory.tableName || pluralize.plural(_.snakeCase(name));
    factory.sequenceId = pluralize.singular(factory.tableName) + '_id';
    ringMaster.acts[name] = new Factory(factory);
  });
}

function rehearse(name, overrides = {}) {
  if (ringMaster.acts[name] === undefined) {
    throw new ActError(name);
  }
  let act = resolveParent(ringMaster.acts[name]);
  let rehearsel = act._resolve(overrides);
  _.each(act.has_one, (relation) => {
    rehearsel[relation] = ringMaster.rehearse(relation);
  });
  _.each(act.belongs_to, (relation) => {
    rehearsel[relation] = ringMaster.rehearse(relation);
  });
  return rehearsel;
}

function recursivePopulate(name, overrides = {}) {
  if (ringMaster.acts[name] === undefined) {
    throw new ActError(name);
  }
  let act = resolveParent(ringMaster.acts[name]);
  let preformance = {};
  return when.all(
    _.map(act.has_one, function(relation) {
      return recursivePopulate(relation, {});
    })
  ).then(function(results) {
    _.map(results, function(result) {
      let relation = {};
      relation[result.relationName] = result.preformance;
      _.assign(act.attributes, result.relationAttribute);
      _.assign(preformance, relation);
    });
    return act._populate(overrides)
      .then(function(result) {
        return dressRehersel(preformance, result);
      })
      .then(function(base) {
        return when.all(
          _.map(act.has_many, function(relation) {
            return recursivePopulate(relation, base.relationAttribute);
          })
        ).then(function(hasManyresults) {
          _.map(hasManyresults, function(hasMany) {
            let relationName = pluralize.plural(hasMany.relationName);
            preformance[relationName] = preformance[relationName] || [];
            preformance[relationName].push(hasMany.preformance);
          });
          return {
            relationName: base.relationName,
            relationAttribute: base.relationAttribute,
            preformance: preformance
          };
        });
      });
  });
}

function dressRehersel(preformance, result) {
  let relationName = result.name;
  let relationAttribute = result.relationAttribute;
  _.assign(preformance, result.attributes);
  return {
    relationName,
    relationAttribute,
    preformance
  };

}

function preform(name, overrides = {}, preformance = {}) {
  return recursivePopulate(name).then(function(result) {
    return result.preformance;
  });
}

function resolveParent(act) {
  if (act.parent === undefined) {
    return act;
  }
  if (ringMaster.acts[act.parent] === undefined) {
    throw new ActError(act.parent);
  }
  act = _.merge(act, ringMaster.acts[act.parent]);
  act.name = act.parent;
  delete act.parent;
  return act;
}

function ActError(value) {
  this.message = `The act ${value} has not been included`;
}

module.exports = ringMaster;