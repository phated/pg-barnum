'use strict';

const { internet } = require('faker');

const User = {
  attributes: {
    password: {
      deps: ['username'],
      value: function() {
        return this.username + 'Password';
      }
    },
    id: 1,
    username: internet.userName,
    paramertizerizedUsername: {
      deps: ['username'],
      value: '<%= username + "-paramertizerid" %>'
    }
  }
};

module.exports = User;
