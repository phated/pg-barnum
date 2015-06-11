const _ = require('lodash');
const pluralize = require('pluralize');

class Composure {

  /**

   */

  constructor(act) {
    this.preformance = {};
    this.act = act;
  }

  insertBelongsTo(relations, overrides) {
    let self = this;
    return relations.then(function(belongToRelations) {
        _.map(belongToRelations, function(result) {
          let relation = {};
          relation[result.relationName] = result.preformance;
          _.assign(self.act.attributes, result.relationAttribute);
          _.assign(self.preformance, relation);
        });
        return self.act._populate(overrides);
      });
  }

  insertHasOne(relations, overrides) {
    let self = this;
    return relations.then(function(hasOneRelations) {
        _.map(hasOneRelations, function(result) {
          let relation = {};
          relation[result.relationName] = result.preformance;
          _.assign(self.preformance, relation);
        });
        return self;
      });
  }

  insertHasManys(relations) {
    let self = this;
    return relations.then(function(hasManyRelations) {
        _.map(hasManyRelations, function(hasMany) {
          let relationName = pluralize.plural(hasMany.relationName);
          self.preformance[relationName] = self.preformance[relationName] || [];
          self.preformance[relationName].push(hasMany.preformance);
        });
        return self;
      });
  }

  composeSelf(results) {
    _.assign(this.preformance, results.attributes);
    this.relationName = results.name;
    this.relationAttribute = results.relationAttribute;
    return this;
  }
}

module.exports = Composure;