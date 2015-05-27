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
  has_many: ['book', 'book', 'book']
};


module.exports = {
  author, authorWithBooks
};