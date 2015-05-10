'use strict';

const { internet } = require('faker');

const User = {
  attributes: {
    username: internet.userName,
    password: '<%= username + "Password" %>'
  }
};

module.exports = User;
