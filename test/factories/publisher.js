'use strict';

const {
  company
} = require('faker');

const publisher = {
  attributes: {
    name: company.companyName
  }
};

module.exports = {
  publisher
};