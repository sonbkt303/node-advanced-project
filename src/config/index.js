export default {
  dataSources: {
    postgresql: {
      client: "pg",
      connection: {
        /* CONNECTION INFO */
        host: "127.0.0.1",
        port: 5432,
        user: "pg-mike",
        password: "1",
        database: "dev",
      },
    },
  },
};
