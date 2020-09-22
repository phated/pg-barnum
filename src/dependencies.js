'use strict';

const _ = require('lodash');
const Topo = require('topo');

function normalizeNodes(attributes){
  return _.map(attributes, function(attr, key){
    if(!_.isPlainObject(attr)){
      return {
        key: key,
        group: key
      };
    } else {
      return {
        key: key,
        group: attr.group || key,
        before: attr.before,
        after: attr.after
      };
    }
  });
}

function dependencies(attributes){
  const topo = new Topo();

  const nodes = normalizeNodes(attributes);

  _.forEach(nodes, function(node){
    topo.add(node.key, node);
  });

  return topo.nodes;
}

module.exports = dependencies;
