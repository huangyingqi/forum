import { GraphQLSchema } from 'graphql';
import { mutationType, queryType } from "./query";

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

export default schema;