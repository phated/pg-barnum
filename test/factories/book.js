'use strict';

const {
  company
} = require('faker');

const book = {
  attributes: {
    title: company.companyName
  }
};

const bookWithPublisher = {
  parent: 'book',
  has_one: ['publisher']
};

module.exports = {
  book,
  bookWithPublisher
};