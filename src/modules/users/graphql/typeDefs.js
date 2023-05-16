export default `#graphql

    directive @auth(requires: Role = ADMIN) on OBJECT | FIELD_DEFINITION

    enum Role {
      ADMIN
      REVIEWER
      USER
    }

    type User @auth(requires: USER) {
      id: ID!
      name: String!
      email: String!
      # banned: Boolean @auth(requires: ADMIN)
      # canPost: Boolean @auth(requires: REVIEWER)
      banned: Boolean
      canPost: Boolean
    }
  
    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
      users: User @auth
    }
`;
