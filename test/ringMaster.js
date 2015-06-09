'use strict';

const {
  experiment, test
} = exports.lab = require('lab').script();
const {
  expect
} = require('code');

var requireDirectory = require('require-directory');

const ringMaster = require('../src/ringMaster');
const factory = require('../src/factory');
const path = require('path');
const factoryPath = path.resolve(__dirname, './factories');
const factories = requireDirectory(module, factoryPath);

experiment('ringMaster', () => {

  exports.lab.beforeEach(function(done) {
    ringMaster.slurp(factoryPath);
    done();
  });

  exports.lab.afterEach(function(done) {
    ringMaster.acts = [];
    ringMaster.vacume(done);
  });

  experiment('rehearse', () => {

    test('can assign objects as a factory inside acts', (done) => {
      expect(ringMaster.acts.user).to.include(factories.user.user);
      done();
    });

    test('can assign multiple objects as factories inside acts', (done) => {
      expect(ringMaster.acts.user).instanceOf(factory);
      expect(ringMaster.acts.user).to.include(factories.user.user);
      expect(ringMaster.acts.userWithAddress).instanceOf(factory);
      expect(ringMaster.acts.userWithAddress).to.include(factories.user.userWithAddress);
      done();
    });

    test('can build via name', (done) => {
      let builtUser = ringMaster.rehearse('user');
      expect(builtUser.password).to.contain('Password');
      done();
    });

    test('can override the default attribute', (done) => {
      let builtUser = ringMaster.rehearse('user', {
        password: 'Totally New'
      });
      expect(builtUser.password).to.contain('Totally New');
      done();
    });

    //parent
    test('can inherient from a parent', (done) => {
      let builtUser = ringMaster.rehearse('userWithAddress');
      expect(builtUser.age).to.equal(32);
      done();
    });

    test('can include it\'s own attributes', (done) => {
      let builtUser = ringMaster.rehearse('userWithAddress', {
        password: 'Totally New'
      });
      expect(builtUser.hobbies).to.contain(['stamps', 'collectables']);
      done();
    });

    test('can override from a parent', (done) => {
      let builtUser = ringMaster.rehearse('userWithAddress', {
        age: 33
      });
      expect(builtUser.age).to.equal(33);
      done();
    });

    test('build an object with it related hasOne object', (done) => {
      let builtUser = ringMaster.rehearse('userWithAddress');
      expect(builtUser.address.city).to.be.a.string();
      done();
    });

  });

  experiment('populate', () => {

    //preform
    test('populate an object with it related hasOne object', (done) => {

      let createdUser = ringMaster.preform('userWithAddress');
      createdUser.then(function(result) {
        expect(result.address.city).to.be.a.string();
        done();
      });
    });

    //preform
    test('populate an object with it related hasMany object', (done) => {
      let createdUser = ringMaster.preform('authorWithBooks');
      createdUser.then(function(result) {
        expect(result.books.length).to.equal(3);
        done();
      });
    });

  });

});