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
const query = require('./migrations/query');

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

    test('calls beforeBuild if it has been defined and merges results with attributes.', (done) => {
      let builtUser = ringMaster.rehearse('userWithBeforeBuild', {
        password: 'Totally New'
      });
      expect(builtUser.password).to.contain('hook password');
      done();
    });

    test('calls afterBuild if it has been defined and run function with created attributes.', (done) => {
      let builtUser = ringMaster.rehearse('userWithAfterBuild', {
        password: 'Totally New'
      });
      expect(builtUser.password).to.contain('Totally New afterBuild');
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

    test('insert the data into the database', (done) => {

      let createdUser = ringMaster.preform('user');
      createdUser.then(function(result) {
        return query('SELECT count(*) from users').then(function(count) {
          expect(count[0][0].count).to.equal('1');
          return done();
        });
      });
    });

    test('passes the attributes to the beforeCreate function if it exists', (done) => {

      let createdUser = ringMaster.preform('userBeforeCreate');
      createdUser.then(function(result) {
        expect(result.password).to.equal(result.username + ' beforeCreate Password');
        return query('SELECT count(*) from users').then(function(count) {
          expect(count[0][0].count).to.equal('1');
          return done();
        });
      });
    });


    test('passes the attributes to the afterCreate function if it exists', (done) => {

      let createdUser = ringMaster.preform('userAfterCreate');
      createdUser.then(function(result) {
        expect(result.token).to.equal('userAfterCreate token');
        return query('SELECT count(*) from users').then(function(count) {
          expect(count[0][0].count).to.equal('1');
          return done();
        });
      });
    });



    test('populate an object with it related belongsTo object', (done) => {

      let createdUser = ringMaster.preform('bookWithPublisher');
      createdUser.then(function(result) {
        expect(result.publisher.name).to.be.a.string();
        done();
      });
    });

    test('populate an object with it related hasMany object', (done) => {
      let createdBook = ringMaster.preform('authorWithBooks');
      createdBook.then(function(result) {
        expect(result.books.length).to.equal(3);
        done();
      });
    });

  });

});