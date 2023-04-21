import { GraphQLScalarType, Kind, GraphQLError } from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert outgoing Date to integer for JSON
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
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
function oddValue(value) {
  console.log('value', value);
  if (typeof value === 'number' && Number.isInteger(value) && value % 2 !== 0) {
    return value;
  }
  throw new GraphQLError('Provided value is not an odd integer', {
    extensions: { code: 'BAD_USER_INPUT' },
  });
}

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
    }

    type Mutation {
      addBook(title: String, author: String): Book
      createBlogPost(content: BlogPostContent!): Book
    }
  `;

export const resolvers = {
  AllowedColor: {
    RED: '#f00',
    GREEN: '#0f0',
    BLUE: '#00f',
  },
  Odd: new GraphQLScalarType({
    name: 'Odd',
    description: 'Odd custom scalar type',
    parseValue: oddValue,
    serialize: oddValue,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return oddValue(parseInt(ast.value, 10));
      }
      throw new GraphQLError('Provided value is not an odd integer', {
        extensions: { code: 'BAD_USER_INPUT' },
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
        message: "12312312"
      };
      // args.borderColor is '#f00', '#0f0', or '#00f'
    },
    echoOdd(_, { odd }) {
      return odd;
    },
  },
};
