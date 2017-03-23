
import { addResolveFunctionsToSchema } from 'graphql-tools';
import { expect } from 'chai';
import buildQueryTree from './../dist/build-query-tree';
import { args, argValues, expectedTree, prepareSchema } from './support';

beforeEach(function () {
  prepareSchema.call(this);
});

describe('buildQueryTree', function () {

  it('should handle nested fields', async function () {
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
    const tree = buildQueryTree(this.info, true);;
    expect(tree).to.eql(expectedTree);
  });

  it('should handle fragments', async function () {
    const query = `
      fragment f1 on Post {
        tags (${args}) {
          id
          tagProp (${args})
          associatedTags (${args}) {
            id
            tagProp (${args})
          }
        }
      }
      query {
        posts (${args}) {
          id
          postProp (${args})
          ...f1
          author (${args}) {
            id
            userProp (${args})
          }
        }
      }
    `;
    await this.runQuery(query);
    const tree = buildQueryTree(this.info, true);;
    expect(tree).to.eql(expectedTree);
  });

  it('should handle inline fragments', async function () {
    const query = `
      query {
        posts (${args}) {
          id
          postProp (${args})
          ... on Post {
            tags (${args}) {
              id
              tagProp (${args})
              associatedTags (${args}) {
                id
                tagProp (${args})
              }
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
    const tree = buildQueryTree(this.info, true);;
    expect(tree).to.eql(expectedTree);
  });

  it('should handle variables', async function () {
    const args = `arg1: $v1, arg3: $v2`
    const query = `
      query ($v1: Int, $v2: ObjectArg) {
        posts (${args}) {
          id
          postProp (${args})
          ... on Post {
            tags (${args}) {
              id
              tagProp (${args})
              associatedTags (${args}) {
                id
                tagProp (${args})
              }
            }
          }
          author (${args}) {
            id
            userProp (${args})
          }
        }
      }
    `;
    const variables = {
      v1: 77,
      v2: { prop1: 'a', prop2: 77, prop3: true, prop4: 88.1 },
    };
    await this.runQuery(query, variables);
    const tree = buildQueryTree(this.info, true);;
    expect(tree).to.eql(expectedTree);
  });

  it('should handle nested resolver', async function () {
    const args = `arg1: $v1, arg3: $v2`
    const query = `
      query ($v1: Int, $v2: ObjectArg) {
        posts (${args}) {
          id
          postProp (${args})
          ... on Post {
            tags (${args}) {
              id
              tagProp (${args})
              associatedTags (${args}) {
                id
                tagProp (${args})
              }
            }
          }
          author (${args}) {
            id
            userProp (${args})
          }
        }
      }
    `;
    const variables = {
      v1: 77,
      v2: { prop1: 'a', prop2: 77, prop3: true, prop4: 88.1 },
    };
    const self = this;
    addResolveFunctionsToSchema(this.schema, {
      Post: {
        author: function (root, args, context, info) {
          self.nestedInfo = info;
          return null;
        }
      },
    });
    await this.runQuery(query, variables);
    const tree = buildQueryTree(this.info, true);
    const nestedTree = buildQueryTree(this.nestedInfo, true);
    expect(tree).to.eql(expectedTree);
    expect(nestedTree).to.eql({
      author: tree.posts.author,
    });
  });

  it('should respect keepRoot = true argument', async function () {
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
    const tree = buildQueryTree(this.info);;
    expect(tree).to.eql(expectedTree.posts);
  });

});

describe('GraphqlQueryTree', function () {

  // describe('#')

});
