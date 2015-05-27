'use strict';

const {
  name
} = require('faker');

const author = {
  attributes: {
    name: name.findName
  }
};

const authorWithBooks = {
  parent: 'author',
  has_many: ['book', 'book', 'bookWithPublisher']
};


module.exports = {
  author, authorWithBooks
};