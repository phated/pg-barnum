'use strict';

const { internet } = require('faker');

const { hasOne } = require('../../src');

const address = require('./address');

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

module.exports = {
  user, userWithAddress
};
