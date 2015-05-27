'use strict';

const {
  company
} = require('faker');

const book = {
  attributes: {
    title: company.companyName
  }
};

module.exports = {
  book
};