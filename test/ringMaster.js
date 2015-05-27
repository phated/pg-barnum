'use strict';

const {
  experiment, test
} = exports.lab = require('lab').script();
const {
  expect
} = require('code');


const userFactories = require('./factories/user');
const user = userFactories.user;
const userWithAddress = userFactories.userWithAddress;
const address = require('./factories/address');

const authorFactories = require('./factories/author');
const book = require('./factories/book');
const publishers = require('./factories/publishers');

const ringMaster = require('../src/ringMaster');
const factory = require('../src/factory');

experiment('ringMaster', () => {

  exports.lab.beforeEach(function(done) {
    ringMaster.acts = [];
    done();
  });

  test('can assign objects as a factory inside acts', (done) => {
    ringMaster.assign({
      user: user
    });
    expect(ringMaster.acts.user).to.include(user);
    done();
  });

  test('can assign multiple objects as factories inside acts', (done) => {
    ringMaster.assign(userFactories);
    expect(ringMaster.acts.user).instanceOf(factory);
    expect(ringMaster.acts.user).to.include(user);
    expect(ringMaster.acts.userWithAddress).instanceOf(factory);
    expect(ringMaster.acts.userWithAddress).to.include(userWithAddress);
    done();
  });

  test('can build via name', (done) => {
    ringMaster.assign(userFactories);
    let builtUser = ringMaster.rehearse('user');
    expect(builtUser.password).to.contain('Password');
    done();
  });

  test('can override the default attribute', (done) => {
    ringMaster.assign(userFactories);
    let builtUser = ringMaster.rehearse('user', {
      password: 'Totally New'
    });
    expect(builtUser.password).to.contain('Totally New');
    done();
  });

  //parent
  test('can inherient from a parent', (done) => {
    ringMaster.assign(userFactories);
    ringMaster.assign({
      address: address
    });
    let builtUser = ringMaster.rehearse('userWithAddress');
    expect(builtUser.age).to.equal(32);
    done();
  });

  test('can include it\'s own attributes', (done) => {
    ringMaster.assign(userFactories);
    ringMaster.assign({
      address: address
    });
    let builtUser = ringMaster.rehearse('userWithAddress', {
      password: 'Totally New'
    });
    expect(builtUser.hobbies).to.contain(['stamps', 'collectables']);
    done();
  });

  test('can override from a parent', (done) => {
    ringMaster.assign(userFactories);
    ringMaster.assign({
      address: address
    });
    let builtUser = ringMaster.rehearse('userWithAddress', {
      age: 33
    });
    expect(builtUser.age).to.equal(33);
    done();
  });

  //relations
  test('build an object with it related has_one object', (done) => {
    ringMaster.assign(userFactories);
    ringMaster.assign({
      address: address
    });
    let builtUser = ringMaster.rehearse('userWithAddress');
    expect(builtUser.address.city).to.be.a.string();
    done();
  });

  //preform
  test('build an object with it related has_one object', (done) => {
    ringMaster.assign(userFactories);
    ringMaster.assign({
      address: address
    });
    let createdUser = ringMaster.preform('userWithAddress');
    createdUser.then(function(result) {
      expect(result.address.city).to.be.a.string();
      done();
    });
  });

  //preform
  test('build an object with it related has_many object', (done) => {
    ringMaster.assign(authorFactories);
    ringMaster.assign(book);
    ringMaster.assign(publishers);
    let createdUser = ringMaster.preform('authorWithBooks');
    createdUser.then(function(result) {
      expect(result.books.length).to.equal(3);
      done();
    });
  });

});