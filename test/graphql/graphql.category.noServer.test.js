/* eslint-disable no-undef */
const Db = require('../../src/server/database/setupDB');
const chai = require('chai');
import {seed} from '../../seed';
const should = chai.should();// eslint-disable-line
import {expect} from 'chai';
import {graphql} from 'graphql';
import Schema from '../../src/server/graphql/rootSchema';
const chalk = require('chalk');
const error = chalk.bold.red;

describe('Graphql Category route testing, no server', () => {
  before(done => {
    seed().then(() => {
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
  });
  after(done => {
    // console.log('Db', Db);
    Db.drop().then(() => {
      done();
    })
    .catch(err => {
      console.error(err);
      done();
    });
  });

  describe('getAllCategories', () => {
    it('it should get all the categories', done => {
      const query = "query{getAllCategories{id,name,visible}}";
      graphql(Schema, query)
      .then(res => {
        const categories = res.data.getAllCategories;
        categories.should.be.a('array');
        categories.length.should.equal(5);
        expect(categories[0]).to.have.property('name');
        expect(categories[1]).to.have.property('visible');
        expect(categories[1]).to.have.property('id');
        expect(categories[0].name).to.equal('assets');
        expect(categories[0]).to.have.property('id');
        expect(categories[0].name).to.be.a('string');
        expect(categories[0].visible).to.be.a('boolean');
        categories[3].visible.should.equal(true);
        done();
      })
      .catch(err => {
        console.log(error(err));
        // done();
      });
    });
  });
  describe('getCategoryById', () => {
    it('it should get a category by id', done => {
      const query = "query{getCategoryById(id:1){id,name,visible}}";
      graphql(Schema, query)
      .then(res => {
        const category = res.data.getCategoryById;
        expect(category).to.have.property('name');
        expect(category).to.have.property('visible');
        expect(category).to.have.property('id');
        expect(category.name).to.equal('assets');
        expect(category).to.have.property('id');
        expect(category.name).to.be.a('string');
        expect(category.visible).to.be.a('boolean');
        done();
      })
      .catch(err => {
        console.log(error(err));
        // done();
      });
    });
  });
  describe('getCategoryProject', () => {
    it('it should get a categorys projects by the category id', done => {
      const query = "query{getCategoryProject(id:1){id,name}}";
      graphql(Schema, query)
      .then(res => {
        const project = res.data.getCategoryProject;
        expect(project).to.be.a('object');
        expect(project).to.have.property('name');
        expect(project).to.have.property('id');
        expect(project.name).to.be.a('string');
        done();
      })
      .catch(err => {
        console.log(error(err));
        // done();
      });
    });
  });
  // describe('createCategory', () => {
  describe('updateCategory', () => {
    it('it should update a category', done => {
      const query = 'mutation{updateCategory(id:4,name:"grease the wheels",visible:false){id,name,visible}}';
      graphql(Schema, query)
      .then(res => {
        const category = res.data.updateCategory;
        expect(category).to.be.a('object');
        expect(category.name).to.equal('grease the wheels');
        expect(category.visible).to.equal(false);
        expect(category.id).to.equal(4);
        done();
      })
      .catch(err => {
        console.log(error(err));
        // done();
      });
    });
  });
  describe('deleteCategory', () => {
    it('it should delete a category', done => {
      const query = 'mutation{deleteCategory(id:4){id,name}}';
      graphql(Schema, query)
      .then(res => {
        const category = res.data.deleteCategory;
        expect(category).to.be.a('object');
        done();
      })
      .catch(err => {
        console.log(error(err));
        // done();
      });
    });
  });}); // end testing block