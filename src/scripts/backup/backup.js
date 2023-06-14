const { spawn } = require("node:child_process");
const path = require("path");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGO_DB_NAME = process.env.MONGODB_DB_NAME || "clever";
const ENVIRONMENT = process.env.ENVIRONMENT || "dev";
const SUCCESS_CODE = 200;
const ERROR_CODE = 400;
const EXIT_SUCCESS_CODE = 0;
const EXIT_FAILURE_CODE = 1;

const main = () => {
  const pathToDumpTool = path.join(
    __dirname,
    "../../../../../../../../Downloads/mongodb-database-tools-windows-x86_64-100.7.2/bin/mongodump"
  );
  let args = [
    `--uri=${MONGO_URI}`,
    `--db=${MONGO_DB_NAME}`,
    // `--collection=${collectionName}`,
    `--out=./backup-data/`,
  ];
  let child = spawn(pathToDumpTool, args);

  child.stdout.on("data", function (data) {
    console.log("stdout: " + data);
  });
  child.stderr.on("data", function (data) {
    console.log(`stderr: ` + data);
  });
  child.on("error", function (error) {
    console.log(`err:` + error);
  });
  child.on("exit", function (code) {
    console.log("mongodump exited with code " + code);
  });
};

main();
