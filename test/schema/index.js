
import { makeExecutableSchema } from 'graphql-tools';
import schema from './schema';

export default function createSchema (resolver) {
  return makeExecutableSchema({
    typeDefs: [schema],
    resolvers: {
      Query: {
        posts: resolver,
      },
      Mutation: {
        updatePosts: resolver,
      },
    },
  });
};
