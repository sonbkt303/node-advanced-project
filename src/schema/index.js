// export * as resolver from './resolver.js';
// export * as typeDefs from './typeDefs.js';

import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
// import { upperDirectiveTransformer } from "./directive.js";
import { upperDirectiveTransformer, authDirectiveTransformer } from "@directives";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
const logInput = async (resolve, root, args, context, info) => {
  // console.log(`1. logInput: ${JSON.stringify(args)}`)
  const result = await resolve(root, args, context, info)
  // console.log(`5. logInput`)
  return result
};

const logResult = async (resolve, root, args, context, info) => {
  // console.log(`2. logResult`)
  const result = await resolve(root, args, context, info)
  // console.log(`4. logResult: ${JSON.stringify(result)}`)
  return result
};

// let schema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
// });

let schema = applyMiddleware(
  makeExecutableSchema(
    {
      typeDefs,
      resolvers,
      plugins: [
        {
          async serverWillStart() {
            console.log("Server starting up!");
          },
        },
        {
          async requestDidStart({ contextValue }) {
            // token is properly inferred as a string
            console.log("111111111", contextValue.token);
          },
        },
      ],
    },
  ),
  logInput,
  logResult,
);

schema = upperDirectiveTransformer(schema, "upper");
schema = authDirectiveTransformer(schema, "auth");

export default schema;
