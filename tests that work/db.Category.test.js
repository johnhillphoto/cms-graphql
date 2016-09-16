/* eslint-disable no-undef */
const Db = require('../src/server/database/setupDB');
const chai = require('chai');
import {seed} from '../seed';

const should = chai.should();// eslint-disable-line no-unused-vars

describe('Category Db testing', () => {
  before(done => {
    seed().then(() => {
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
  });

  describe('Get all categories', () => {
    it('should get all categories', done => {
      Db.models.category.findAll()
      .then(categories => {
        categories.should.be.a('array');
        categories.length.should.equal(3);
        categories[0].should.have.property('name');
        categories[1].should.have.property('visible');
        categories[0].should.have.property('id');
        categories[1].should.have.property('createdAt');
        categories[0].should.have.property('updatedAt');
        done();
      }); // end then
    });
  });

  describe('Create a category', () => {
    it('should create a project', done => {
      const newCategory = {
        name: 'promotion',
        visible: true
      };
      Db.models.category.create(newCategory)
      .then(category => {
        category.should.be.a('object');
        category.should.have.property('visible');
        category.should.have.property('id');
        category.should.have.property('createdAt');
        category.should.have.property('updatedAt');
        done();
      }); // end then
    });
  });
}); // end projects test block