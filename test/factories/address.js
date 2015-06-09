'use strict';

const { address } = require('faker');

const addressFactory = {
  name: 'address',
  attributes: {
    city: address.city,
    address: address.streetAddress
  }
};

module.exports = {addressFactory};
