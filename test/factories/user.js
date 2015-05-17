'use strict';

const { internet, name } = require('faker');

const User = {
  attributes: {
    id: 1,
    password: {
      after: 'username',
      default: '<%= username + "Password" %>'
    },
    username: internet.userName,
    firstName: {
      group: 'first',
      default: name.firstName()
    },
    lastName: {
      after: 'first',
      default: name.lastName()
    }
  }
};

module.exports = User;
