'use strict';

const { company } = require('faker');

const book = {
  attributes: {
    title: company.companyName
  }
};

const bookWithPublisher = {
  parent: 'book',
  belongsTo: ['publisher'],
  attributes: {
  }
};

module.exports = {
  book,
  bookWithPublisher
};
