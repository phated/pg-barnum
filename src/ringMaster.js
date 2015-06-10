'use strict';

const _ = require('lodash');
const pluralize = require('pluralize');
const Factory = require('./factory');
const truncate = require('./truncate');
const when = require('when');
var requireDirectory = require('require-directory');


const ringMaster = {
  acts: {},
  active: {},
  assign: assign,
  rehearse: rehearse,
  slurp: slurp,
  preform: preform,
  vacume: vacume
};

function slurp(directory) {
  requireDirectory(module, directory, {
    visit: assign
  });
}

function assign(factories = {}) {
  _.mapValues(factories, (factory, key) => {
    factory.name = factory.name || key;
    const name = factory.name;
    const snakeCaseName = _.snakeCase(name);
    factory.foreignKey = factory.foreignKey || pluralize.singular(snakeCaseName + '_id');
    factory.tableName = factory.tableName || pluralize.plural(snakeCaseName);
    ringMaster.acts[name] = new Factory(factory);
  });
}

function rehearse(name, overrides = {}) {
  if (ringMaster.acts[name] === undefined) {
    throw new ActError(name);
  }
  let act = resolveParent(ringMaster.acts[name]);
  let rehearsel = act._resolve(overrides);
  _.each(act.hasOne, (actName) => {
    const baseName = _getBaseNameOfFactory(actName);
    rehearsel[baseName] = ringMaster.rehearse(actName);
  });
  _.each(act.belongsTo, (actName) => {
    const baseName = _getBaseNameOfFactory(actName);

    rehearsel[baseName] = ringMaster.rehearse(actName);
  });
  _.each(act.hasMany, (actName) => {
    const baseName = _getBaseNameOfFactory(actName);
    rehearsel[baseName] = [];
    rehearsel[baseName].push(ringMaster.rehearse(actName));
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
    _.map(act.hasOne, function(relation) {
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
        ringMaster.active[act.tableName] = ringMaster.active[act.tableName] || [];
        ringMaster.active[act.tableName].push(result.attributes.id);
        return dressRehersel(preformance, result);
      })
      .then(function(base) {
        return when.all(
          _.map(act.hasMany, function(relation) {
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
    throw new Error(`The preformance was canceled. Should not have preformed the scottish one.\n ${err.stack}`);
  });
}

function dressRehersel(preformance, result) {
  _.assign(preformance, result.attributes);
  return {
    relationName: result.name,
    relationAttribute: result.relationAttribute,
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
  const parentAct = ringMaster.acts[act.parent];
  act = _.merge(act, resolveParent(parentAct));
  act.name = act.parent;
  delete act.parent;
  return act;
}

function _getBaseNameOfFactory(name) {
  const act = ringMaster.acts[name];
  if (act.parent === undefined) {
    return name;
  }
  return _getBaseNameOfFactory(act.name);
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