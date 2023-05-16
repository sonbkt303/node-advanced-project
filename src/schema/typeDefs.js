import { mergeTypeDefs } from '@graphql-tools/merge';
import userTypeDefs from '../modules/users/graphql/typeDefs.js';

export const baseTypeDefs = `#graphql
    scalar MyCustomScalar
    scalar Date  # highlight-line 
    scalar Odd
    scalar JSON

    directive @upper on FIELD_DEFINITION
    directive @isAuthenticated on FIELD_DEFINITION
    directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

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

    # A library has a branch and books
    type Library {
      branch: String!
      books: [Book!]
    }
  
    # A book has a title and author
    type Book {
      title: String!
      author: Author!
    }
  
    # An author has a name
    type Author {
      name: String!
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
      libraries: [Library]
      adminExample: String
    }

    type Mutation {
      addBook(title: String, author: String): Book
      createBlogPost(content: BlogPostContent!): Book
    }
  `;


const typeDefs = [baseTypeDefs, userTypeDefs];

export default mergeTypeDefs(typeDefs);