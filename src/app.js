import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
dotenv.config();
// const expressPlayground = require('graphql-playground-middleware-express')
  // .default
import expressPlayground from 'graphql-playground-middleware-express';

const app = express();


console.log("process.env.PORT", process.env.PORT)

const port = process.env.PORT || 3000;

let schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
let root = {
  hello: () => {
    return "Hello world!";
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

