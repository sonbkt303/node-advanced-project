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
    users: async (parent, args, { dataSources }, info) => {
      const data = await dataSources.pg.select("*").from("users");
      const userMongo = await dataSources.mongo.model("User").find();

      console.log("userMongo", userMongo);

      return "mike";
    },
  },
  Mutation: {},
};

export default resolver;
