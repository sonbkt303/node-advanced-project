import dotenv from "dotenv";
import express from "express";
// import { graphqlHTTP } from "express-graphql";
// import { buildSchema } from "graphql";
dotenv.config();
import { ApolloServer } from "@apollo/server";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
// import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
// import { typeDefs, upperDirectiveTransformer } from "./schema/index.js";
// import { resolvers } from "./schema/resolvers.js";
// import { typeDefs } from "./schema/typeDefs.js";
// import { upperDirectiveTransformer } from "./schema/directive.js";
import schema from "./schema/index.js";
import MyDatabase from "./datasource/myDatabase.js";

const knexConfig = {
  client: "pg",
  connection: {
    /* CONNECTION INFO */
    host: "127.0.0.1",
    port: 5432,
    user: "pg-mike",
    password: "1",
    database: "dev",
  },
};

const postgresqlConnection = new MyDatabase(knexConfig);

// const expressPlayground = require('graphql-playground-middleware-express')
// .default

const PORT = process.env.PORT || 3000;
const PORT_GRAPHQL = process.env.PORT_GRAPHQL || 4000;

const getScope = (authScope) => {
  return authScope;
};


// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  schema,
  // dataSources: () => ({ db }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // ApolloServerPluginUsageReporting({
    //   fieldLevelInstrumentation: 0.5,
    // }),
  ],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors(),
  bodyParser.json({ limit: "50mb" }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      return {
        token: req.headers.token,
        authScope: getScope(req.headers.authorization),
        dataSources: {
          pg: postgresqlConnection?.db
        },
      };
    },
  })
);

// Modified server startup
await new Promise((resolve) =>
  httpServer.listen({ port: PORT_GRAPHQL }, resolve)
);

console.log(`🚀 Server ready at http://localhost:${PORT_GRAPHQL}/`);
