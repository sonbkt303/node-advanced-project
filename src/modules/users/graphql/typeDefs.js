export default 
`#graphql
    type User {
      id: ID!
      name: String!
      email: String!
    }
  
    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
      users: String
    }
`;