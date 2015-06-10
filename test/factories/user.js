'use strict';

const {
  internet
} = require('faker');

const user = {
  attributes: {
    age: 32,
    username: internet.userName,
    password: '<%= username + "Password" %>'
  }
};

const userWithAddress = {
  parent: 'user',
  hasOne: ['address'],
  attributes: {
    hobbies: 'stamps, collectables'
  }
};

const userWithBeforeBuild = {
  parent: 'user',
  hasOne: ['address'],
  beforeBuild: function() {
    return {
      password: 'hook password'
    };
  },
  attributes: {
    hobbies: 'stamps, collectables'
  }
};

const userWithAfterBuild = {
  parent: 'user',
  hasOne: ['address'],
  afterBuild: function(attributes) {
    attributes.password = attributes.password + ' afterBuild';
    return attributes;
  },
  attributes: {
    hobbies: 'stamps, collectables'
  }
};

const userBeforeCreate = {
  parent: 'user',
  beforeCreate: function(attributes) {
    attributes.password = attributes.username + ' beforeCreate Password';
    return attributes;
  }
};

const userAfterCreate = {
  parent: 'user',
  afterCreate: function(attributes) {
    attributes.token = 'userAfterCreate token';
    return attributes;
  }
};

module.exports = {
  user,
  userWithAddress,
  userWithBeforeBuild,
  userWithAfterBuild,
  userBeforeCreate,
  userAfterCreate
};
