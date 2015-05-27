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
  attributes: {
    hobbies: 'stamps, collectables'
  },
  has_one: ['address']
};


module.exports = {
  user, userWithAddress
};