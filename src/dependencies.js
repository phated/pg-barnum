'use strict';

const _ = require('lodash');
const Topo = require('topo');

function normalizeNodes(attributes){
  return _.map(attributes, function(attr, key){
    let node;
    if(!_.isPlainObject(attr)){
      node = {
        key: key,
        group: key
      };
    } else {
      node = {
        key: key,
        group: attr.group || key,
        before: attr.before,
        after: attr.after
      };
    }

    return node;
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
