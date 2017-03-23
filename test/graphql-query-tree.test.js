
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { expect } from 'chai';
import GraphqlQueryTree from './../dist/graphql-query-tree';
import { args, argValues, expectedTree, prepareSchema } from './support';

beforeEach(function () {
  prepareSchema.call(this);
});

describe('GraphqlQueryTree', function () {

  beforeEach(async function () {
    const query = `
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

});
