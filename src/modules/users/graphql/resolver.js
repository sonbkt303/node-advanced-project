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
      const data = await dataSources.pg.select("*").from("users");
      const userMongo = await dataSources.mongo.model("User").find();
      console.log("userMongo", userMongo);

      container.resolve('sayHi');

      return "mike";
    },
  },
  Mutation: {},
};

export default resolver;
