// export * as resolver from './resolver.js';
// export * as typeDefs from './typeDefs.js';

import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";
import { upperDirectiveTransformer } from "./directive.js";
import { makeExecutableSchema } from "@graphql-tools/schema";

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  plugins: [
    {
      async serverWillStart() {
        console.log('Server starting up!');
      },
    },
    {
      async requestDidStart({ contextValue }) {
        // token is properly inferred as a string
        console.log('111111111', contextValue.token);
      },
    },
  ],
});

schema = upperDirectiveTransformer(schema, "upper");

export default schema;
