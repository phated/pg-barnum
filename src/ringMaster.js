'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const Factory = require('./factory');
const truncate = require('./truncate');
const when = require('when');

const ringMaster = {
  acts: {},
  active: {},
  assign: assign,
  rehearse: rehearse,
  preform: preform,
  vacume: vacume
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
  let properties = act._resolve(overrides);
  _.each(act.belongs_to, (relation) => {
    properties[relation] = ringMaster.rehearse(relation);
  });
  return properties;
}

function recursivePopulate(name, overrides = {}) {
  if (ringMaster.acts[name] === undefined) {
    throw new ActError(name);
  }
  let act = resolveParent(ringMaster.acts[name]);
  let preformance = {};
  const hasOneDeps = _.reduce(act.attributes, function(result, attr){
    if(_.has(attr, 'relation')){
      result.push(recursivePopulate(attr.relation.name, {}));
    }
    return result;
  }, []);
  return when.all(
    hasOneDeps
  ).then(function(results) {
    _.map(results, function(result) {
      let relation = {};
      relation[result.relationName] = result.preformance;
      _.assign(act.attributes, result.relationAttribute);
      // TODO: I don't like deleting here, maybe we can implement a serialize on factory instead
      delete act.attributes[result.relationName];
      _.assign(preformance, relation);
    });
    return act._populate(overrides)
      .then(function(result) {
        ringMaster.active[act.tableName] = ringMaster.active[act.tableName] || [];
        ringMaster.active[act.tableName].push(result.attributes.id);
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
  }).catch(function onReject(err) {
    console.log('FAILED\n The preformance was canceled. Shouldn\'t have preformed the scottish one.\n', err);
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

function vacume(done) {
  return when.all(_.map(_.keys(this.active), function(table) {
      truncate(table);
    }))
    .yield(function(result) {
      ringMaster.active = {};
    })
    .then(done());
}

module.exports = ringMaster;
