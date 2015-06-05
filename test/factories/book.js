'use strict';

const { company } = require('faker');

const { hasOne } = require('../../src');

const publisher = require('./publisher');

const book = {
  attributes: {
    title: company.companyName
  }
};

const bookWithPublisher = {
  parent: 'book',
  attributes: {
    publisher: hasOne(publisher)
  }
};

module.exports = {
  book,
  bookWithPublisher
};
