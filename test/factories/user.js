'use strict';

const { internet, name } = require('faker');

const User = {
  attributes: {
    combined: {
      after: ['id', 'password', 'fullName'],
      default: '<%= id + password + fullName %>'
    },
    id: 1,
    password: {
      after: 'username',
      default: '<%= username + "Password" %>'
    },
    username: internet.userName,
    firstName: {
      group: 'name',
      default: name.firstName
    },
    lastName: {
      group: 'name',
      default: name.lastName
    },
    fullName: {
      after: 'name',
      default: function(){
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }
};

module.exports = User;
