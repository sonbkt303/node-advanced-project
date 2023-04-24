
import { SQLDataSource } from "datasource-sql";
import { dbConfig } from "../config/index.js";

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

const postgresqlConnection = new MyDatabase(dbConfig.postgresql);

export default postgresqlConnection;

// export default MyDatabase;