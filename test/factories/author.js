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
  hasMany: ['book', 'book', 'bookWithPublisher']
};


module.exports = {
  author, authorWithBooks
};