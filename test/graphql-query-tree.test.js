
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { expect } from 'chai';
import GraphqlQueryTree from './../dist/graphql-query-tree';
import { args, argValues, expectedTree, prepareSchema } from './support';

beforeEach(function () {
  prepareSchema.call(this);
});

describe('GraphqlQueryTree', function () {

  beforeEach(async function () {
    const query = this.query = `
      query {
        posts (${args}) {
          id
          postProp (${args})
          tags (${args}) {
            id
            tagProp (${args})
            associatedTags (${args}) {
              id
              tagProp (${args})
            }
          }
          author (${args}) {
            id
            userProp (${args})
          }
        }
      }
    `;
    await this.runQuery(query);
  });

  describe('#constructor', function () {

    it('should create query tree', async function () {
      const tree = new GraphqlQueryTree(this.info);
      expect(tree._tree).to.eql(expectedTree.posts);
    });

    it('should respect keepRoot option', async function () {
      const tree = new GraphqlQueryTree(this.info, true);
      expect(tree._tree).to.eql(expectedTree);
    });

  });

  describe('#isSelected', function () {

    it('should return true/false if field was selected/not selected', async function () {
      const tree = new GraphqlQueryTree(this.info);
      expect(tree.isSelected('tags.associatedTags.id')).to.equal(true);
      expect(tree.isSelected('tags.associatedTags.other')).to.equal(false);
    });

  });

  describe('#getArguments', function () {

    it('should return field arguments or null', async function () {
      const tree = new GraphqlQueryTree(this.info);
      expect(tree.getArguments('tags.associatedTags.id')).to.eql({});
      expect(tree.getArguments('tags.associatedTags.other')).to.eql(null);
      expect(tree.getArguments('tags.associatedTags.tagProp')).to.eql(argValues);
      expect(tree.getArguments()).to.eql(argValues);
      const tree2 = new GraphqlQueryTree(this.info, true);
      expect(tree2.getArguments()).to.equal(null);
      expect(tree2.getArguments('posts')).to.eql(argValues);
    });

  });

  describe('#getChildFields', function () {

    it('should return child fields', async function () {
      const tree = new GraphqlQueryTree(this.info);
      expect(tree.getChildFields().sort()).to.eql([ 'id', 'postProp', 'tags', 'author' ].sort());
      expect(tree.getChildFields('tags.associatedTags').sort()).to.eql([ 'id', 'tagProp'].sort());
      expect(tree.getChildFields('tags.other')).to.equal(null);
      const tree2 = new GraphqlQueryTree(this.info, true);
      expect(tree2.getChildFields().sort()).to.eql([ 'posts' ].sort());
      expect(tree2.getChildFields('posts.tags.associatedTags').sort()).to.eql([ 'id', 'tagProp'].sort());
    });

  });

  describe('#getParentType', function () {

    it('should return parent type', async function () {
      const self = this;
      addResolveFunctionsToSchema(this.schema, {
        Post: {
          author: function (root, args, context, info) {
            self.nestedInfo = info;
            return null;
          }
        },
      });
      await this.runQuery(this.query);
      const tree = new GraphqlQueryTree(this.info);
      const nestedTree = new GraphqlQueryTree(this.nestedInfo);
      expect(tree.getParentType()).to.equal('Query');
      expect(nestedTree.getParentType()).to.equal('Post');
    });

  });

  describe('#getReturnType', function () {

    it('should return return type', async function () {
      const self = this;
      addResolveFunctionsToSchema(this.schema, {
        Post: {
          author: function (root, args, context, info) {
            self.nestedInfo = info;
            return null;
          }
        },
      });
      await this.runQuery(this.query);
      const tree = new GraphqlQueryTree(this.info);
      const nestedTree = new GraphqlQueryTree(this.nestedInfo);
      expect(tree.getReturnType()).to.equal('Post');
      expect(nestedTree.getReturnType()).to.equal('User');
    });

  });

  describe('#getParentField', function () {

    it('should return parent field', async function () {
      const self = this;
      addResolveFunctionsToSchema(this.schema, {
        Post: {
          author: function (root, args, context, info) {
            self.nestedInfo = info;
            return null;
          }
        },
      });
      await this.runQuery(this.query);
      const tree = new GraphqlQueryTree(this.info);
      const nestedTree = new GraphqlQueryTree(this.nestedInfo);
      expect(tree.getParentField()).to.equal('posts');
      expect(nestedTree.getParentField()).to.equal('author');
    });

  });

  describe('#getField', function () {

    it('should return type of field at given path', async function () {
      const self = this;
      await this.runQuery(this.query);
      const tree = new GraphqlQueryTree(this.info);
      expect(tree.getType()).to.equal('Post');
      expect(tree.getType('author')).to.equal('User');
      expect(tree.getType('tags')).to.equal('Tag');
      expect(tree.getType('tags.associatedTags')).to.equal('Tag');
    });

  });

});
