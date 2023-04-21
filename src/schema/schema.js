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
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
    # This "Book" type defines the queryable fields for every book in our data source.
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
      avatar(borderColor: AllowedColor): String # enum argument
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
  Query: {
    books: () => books,
    avatar: (parent, args) => {

      console.log("args", args);
      console.log("parent", parent);

      return '123123';
      // args.borderColor is '#f00', '#0f0', or '#00f'
    },
  },
};
