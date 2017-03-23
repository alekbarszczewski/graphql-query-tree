
# graphql-query-tree [![Build Status](https://travis-ci.org/alekbarszczewski/graphql-query-tree.svg?branch=master)](https://travis-ci.org/alekbarszczewski/graphql-query-tree)

Parse `info` object (passed to resolver) into a query tree and extract useful info from it.

## Installation

```sh
$ npm install --save graphql-query-tree
```

## Features

* Parse `info` argument (passed to resolver) into GraphqlQueryTree
  * Supports Fragments and InlineFragments
* Check if field at given path is present in query
* Get arguments for field at given path
  * Supports variables
  * Supports default argument(s) values
* Get child fields (keys) of field at given path

## Usage

```gql
query {
  posts (limit: 20) {
    id
    title
    author {
      id
      name
    }
    tags (limit: 10, sort: "created_at") {
      id
      text
    }
  }
}
```

```js
import GraphqlQueryTree from 'graphql-query-tree';

export default function (root, args, context, info) {
  const tree = new GraphqlQueryTree(info);

  // check if field is selected
  tree.isSelected('tags'); // true
  tree.isSelected('author.profilePicture'); // false

  // get field arguments
  tree.getArguments('tags'); // { limit: 10, sort: 'created_at' }
  tree.getArguments(); // { limit: 20 }
  tree.getArguments('some.invalid.path'); // null

  // get child fields
  tree.getChildFields('tags'); // ['id', 'text']
  tree.getChildFields('some.invalid.path'); // null
}
```
