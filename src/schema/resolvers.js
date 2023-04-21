
import { GraphQLScalarType, Kind, GraphQLError } from "graphql";
import GraphQLJSON from "graphql-type-json";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { makeExecutableSchema } from "@graphql-tools/schema";


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
    },
  };