;
import express from "express";
import dotenv from "dotenv";
const app = express();
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
require("dotenv").config();

// console.log("process.env.PORT", process.env.PORT)

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

