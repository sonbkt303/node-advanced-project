// export default {
//   dataSources: {
//     postgresql: {
//       client: "pg",
//       connection: {
//         /* CONNECTION INFO */
//         host: "127.0.0.1",
//         port: 5432,
//         user: "pg-mike",
//         password: "1",
//         database: "dev",
//       },
//     },
//     mongodb: {
//       url: "mongodb://127.0.0.1:27017/simple_db"
//     }
//   },
// };

export { default as dbConfig } from './db.js';
export * as modelConfig from './models.js';