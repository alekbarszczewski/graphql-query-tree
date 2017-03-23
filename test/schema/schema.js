
export default `

input ObjectArg {
  prop1: String
  prop2: Int
  prop3: Boolean
  prop4: Float
  prop5: String = "a"
  prop6: Int = 1
  prop7: Boolean = true
  prop8: Float = 99.1
}

type User {
  id: Int!
  userProp (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): Int!
}

type Tag {
  id: Int
  tagProp (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): Int!
  associatedTags (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): [Tag!]!
}

type Post {
  id: Int!
  postProp (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): Int!
  tags (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): [Tag!]!
  author (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): User
}

type Query {
  posts (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): [Post!]!
}

type Mutation {
  updatePosts (arg1: Int, arg2: Int = 2, arg3: ObjectArg, arg4: ObjectArg = { prop1: "b" }): [Post!]!
}

type schema {
  query: Query
  mutation: Mutation
}

`;
