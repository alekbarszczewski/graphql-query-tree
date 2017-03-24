
import { graphql } from 'graphql';
import buildSchema from './schema';

export const args = `arg1: 77, arg3: { prop1: "a", prop2: 77, prop3: true, prop4: 88.1 }`

export const argValues = {
  arg1: 77,
  arg2: 2,
  arg3: {
    prop1: 'a',
    prop2: 77,
    prop3: true,
    prop4: 88.1,
    prop5: 'a',
    prop6: 1,
    prop7: true,
    prop8: 99.1,
  },
  arg4: {
    prop1: 'b',
    prop5: 'a',
    prop6: 1,
    prop7: true,
    prop8: 99.1,
  },
};

export const expectedTree = {
  posts: {
    $args: argValues,
    $type: 'Post',
    id: { $args: {}, $type: 'Int' },
    postProp: { $args: argValues, $type: 'Int' },
    tags: {
      $args: argValues,
      $type: 'Tag',
      id: { $args: {}, $type: 'Int' },
      tagProp: { $args: argValues, $type: 'Int' },
      associatedTags: {
        id: { $args: {}, $type: 'Int' },
        tagProp: { $args: argValues, $type: 'Int' },
        $args: argValues,
        $type: 'Tag',
      },
    },
    author: {
      $type: 'User',
      $args: argValues,
      id: { $args: {}, $type: 'Int' },
      userProp: { $args: argValues, $type: 'Int' },
    }
  },
};

export function prepareSchema () {
  const schema = this.schema = buildSchema((root, args, context, info) => {
    this.info = info;
    return [{ id: 1, postProp: 1, tags: [] }];
  });
  this.runQuery = async function (query, variables) {
    const result = await graphql(schema, query, {}, {}, variables);
    if (result.errors && result.errors.length) {
      throw result.errors[0];
    }
    return result;
  };
}
