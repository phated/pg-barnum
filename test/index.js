'use strict';

const { experiment, test } = exports.lab = require('lab').script();
const { expect } = require('code');

const { populate } = require('../src');

experiment('pg-barnum', () => {

  test('populate', (done) => {
    expect(populate()).to.equal(1);
    done();
  });
});
