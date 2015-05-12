'use strict';

const { experiment, test } = exports.lab = require('lab').script();
const { expect } = require('code');

const { populate, schema } = require('../src');

const factories = {
  user: require('./factories/user')
};

experiment('populate', () => {

  test('TODO', (done) => {
    populate({}, (err, res) => {
      expect(err).to.not.exist();
      expect(res).to.equal(1);
      done();
    });
  });
});

experiment('schema', () => {

  test('leaves normal values alone', (done) => {
    const { id } = schema(factories.user);
    expect(id).to.be.a.number();
    expect(id).to.equal(1);
    done();
  });

  test('resolve properties that are functions', (done) => {
    const { username } = schema(factories.user);
    expect(username).to.be.a.string();
    done();
  });

  test('resolves properties that are templates', (done) => {
    const { username, password } = schema(factories.user);
    expect(password).to.contain(username);
    expect(password).to.contain('Password');
    done();
  });

  test('resolves properties that are templates that depend on other attr', (done) => {
    const { username, password, paramertizerizedUsername } = schema(factories.user);
    expect(password).to.contain(username);
    expect(paramertizerizedUsername).to.contain(username + '-paramertizerid');
    done();
  });
});
