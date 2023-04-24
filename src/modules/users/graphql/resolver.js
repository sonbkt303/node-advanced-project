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

const resolver = {
  Query: {
    users: async (parent, args, { dataSources, container }, info) => {
      //   const data = await dataSources.pg.select("*").from("users");
      //   const userMongo = await dataSources.mongo.model("User").find();
      //   console.log("userMongo", userMongo);

      //   container.resolve('sayHi');
      //   const mongoUser = await container.resolve('mongodbConnection').model('User').find();

      //   console.log("111 userMongo", mongoUser);

      const users = await container.resolve("userProvider").find();

      console.log("111  users", users);

      return "mike";
    },
  },
  Mutation: {},
};

export default resolver;
