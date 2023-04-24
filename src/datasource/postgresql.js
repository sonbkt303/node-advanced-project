
import { SQLDataSource } from "datasource-sql";
import config from "../config/index.js";

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
  // getFruits() {
  //   return this.knex
  //     .select("*")
  //     .from("fruit")
  //     .where({ id: 1 })
  //     .cache(MINUTE);
  // }
};

const postgresqlConnection = new MyDatabase(config.dataSources.postgresql);

export default postgresqlConnection;

// export default MyDatabase;