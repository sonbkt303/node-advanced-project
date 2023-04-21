// export * as resolver from './resolver.js';
// export * as typeDefs from './typeDefs.js';

import { resolvers } from './resolvers.js';
import { typeDefs } from './typeDefs.js';
import { upperDirectiveTransformer } from "./directive.js";
import { makeExecutableSchema } from '@graphql-tools/schema';

let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  
schema = upperDirectiveTransformer(schema, 'upper');

export default schema;