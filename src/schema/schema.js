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

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
export const upperDirectiveTransformer = (schema, directiveName) => {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const upperDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (upperDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          if (typeof result === "string") {
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
};

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const typeDefs = `#graphql

    scalar MyCustomScalar
    scalar Date  # highlight-line 
    scalar Odd
    scalar JSON

    directive @upper on FIELD_DEFINITION


    interface MutationResponse {
      code: String!
      success: Boolean!
      message: String
    }

    type UpdateUserEmailMutationResponse implements MutationResponse {
      code: String!
      success: Boolean!
      message: String
      user: User
    }

    # Example with scalar Json third party
    type MyObject {
      myField: JSON
    }

    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
    # This "Book" type defines the queryable fields for every book in our data source.

    type ExampleType {
      oldField: String @deprecated(reason: "Use newField.")
      newField: String
    }

    type User {
      id: ID!
      name: String!
      email: String!
    }

    type Book {
      title: String
      author: String
    }

    type Author {
      name: String
    }

    input BlogPostContent {
      title: String
      body: String
      media: [MediaDetails!]
    }
    
    input MediaDetails {
      format: MediaFormat!
      url: String!
    } 
    
    enum MediaFormat {
      IMAGE
      VIDEO
    }

    enum AllowedColor {
      RED
      GREEN
      BLUE
    }
  
    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
      books: [Book]
      author: [Author]
      avatar(borderColor: AllowedColor): UpdateUserEmailMutationResponse # enum argument
      echoOdd(odd: Odd!): Odd!
      hello: String @upper

    }

    type Mutation {
      addBook(title: String, author: String): Book
      createBlogPost(content: BlogPostContent!): Book
    }
  `;

// export const resolvers = {
//   AllowedColor: {
//     RED: "#f00",
//     GREEN: "#0f0",
//     BLUE: "#00f",
//   },
//   Odd: new GraphQLScalarType({
//     name: "Odd",
//     description: "Odd custom scalar type",
//     parseValue: oddValue,
//     serialize: oddValue,
//     parseLiteral(ast) {
//       if (ast.kind === Kind.INT) {
//         return oddValue(parseInt(ast.value, 10));
//       }
//       throw new GraphQLError("Provided value is not an odd integer", {
//         extensions: { code: "BAD_USER_INPUT" },
//       });
//     },
//   }),
//   Date: dateScalar,

//   Query: {
//     books: () => books,
//     avatar: (parent, args) => {
//       console.log("args", args);

//       return {
//         code: 2,
//         success: true,
//         message: "12312312",
//       };
//       // args.borderColor is '#f00', '#0f0', or '#00f'
//     },
//     echoOdd(_, { odd }) {
//       return odd;
//     },
//     hello() {
//       return "Hello World!";
//     },
//   },
// };



