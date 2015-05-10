'use strict';

const { internet } = require('faker');

const User = {
  attributes: {
    id: 1,
    username: internet.userName,
    password: '<%= username + "Password" %>'
  }
};

module.exports = User;
