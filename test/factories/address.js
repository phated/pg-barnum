'use strict';

const { address } = require('faker');

const Address = {
  name: 'address',
  attributes: {
    city: address.city,
    address: address.streetAddress
  }
};

module.exports = Address;
