import { GraphQLScalarType, Kind, GraphQLError } from "graphql";
import GraphQLJSON from "graphql-type-json";

const users = [
  {
    id: "1",
    name: "Elizabeth Bennet",
  },
  {
    id: "2",
    name: "Fitzwilliam Darcy",
  },
];

const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    branch: "riverside",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    branch: "downtown",
  },
];

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "number") {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error("GraphQL Date Scalar parser expected a `number`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    // Invalid hard-coded value (not an integer)
    return null;
  },
});

// Validation function for checking "oddness"
const oddValue = (value) => {
  console.log("value", value);
  if (typeof value === "number" && Number.isInteger(value) && value % 2 !== 0) {
    return value;
  }
  throw new GraphQLError("Provided value is not an odd integer", {
    extensions: { code: "BAD_USER_INPUT" },
  });
};

export const resolvers = {
  AllowedColor: {
    RED: "#f00",
    GREEN: "#0f0",
    BLUE: "#00f",
  },
  Odd: new GraphQLScalarType({
    name: "Odd",
    description: "Odd custom scalar type",
    parseValue: oddValue,
    serialize: oddValue,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return oddValue(parseInt(ast.value, 10));
      }
      throw new GraphQLError("Provided value is not an odd integer", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    },
  }),
  Date: dateScalar,
  Library: {
    books(parent) {
      console.log("parent", parent);
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return books.filter((book) => book.branch === parent.branch);
    },
  },
  Book: {
    // The parent resolver (Library.books) returns an object with the
    // author's name in the "author" field. Return a JSON object containing
    // the name, because this field expects an object.
    author(parent) {
      return {
        name: parent.author,
      };
    },
  },
  Query: {
    books: () => books,
    avatar: (parent, args) => {
      console.log("args", args);
      return {
        code: 2,
        success: true,
        message: "12312312",
      };
      // args.borderColor is '#f00', '#0f0', or '#00f'
    },
    echoOdd(_, { odd }) {
      return odd;
    },  
    hello() {
      return "Hello World!";
    },
    libraries() {
      // Return our hardcoded array of libraries
      return libraries;
    },
  },
};
