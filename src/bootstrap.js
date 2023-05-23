import dotenv from "dotenv";
import express from "express";
import container from "./container.js";
import { ApolloServer } from "@apollo/server";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import schema from "./schema/index.js";
import { mongodb, postgresql } from "@datasource";
const PORT_GRAPHQL = process.env.PORT_GRAPHQL || 4000;
import https from "https";
import fs from "fs";
import multer from "multer";
// import a from "./config/ssl/production/sever.key";

// const data = fs.readFileSync("./config/ssl/production/sever.txt", { encoding: "utf8", flag: "r" });

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: false, port: 443, hostname: "example.com" },
  development: { ssl: false, port: 4000, hostname: "localhost" },
};

/**
 * Disk storage multer
 */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, destinationPath);
//   },
//   filename: function (req, file, cb) {
//     const { originalname } = file;
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + "-" + originalname);
//   },
// });

const storage = multer.memoryStorage()


// Multer Filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1]) {
    cb(null, true);
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

const environment = process.env.NODE_ENV || "production";
const config = configurations[environment];

export const bootstrap = async () => {
  // Required logic for integrating with Express
  const app = express();
  app.options('*', cors()) // include before other routes
  app.use(cors({
    origin: "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Apollo-Tracing"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  }));

  let httpServer;

  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(
      // {
      //   key: fs.readFileSync("./config/ssl/production/sever.key"),
      //   cert: fs.readFileSync(`./config/ssl/${environment}/server.crt`),
      // },
      app
    );
  } else {
    // Our httpServer handles incoming requests to our Express app.
    // Below, we tell Apollo Server to "drain" this httpServer,
    // enabling our servers to shut down gracefully
    httpServer = http.createServer(app);
  }
  // Same ApolloServer initialization as before, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    schema,
    // dataSources: () => ({ db }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // ApolloServerPluginUsageReporting({
      //   fieldLevelInstrumentation: 0.5,
      // }),
    ],
  });
  // Ensure we wait for our server to start
  await server.start();

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/graphql",
    bodyParser.json({ limit: "50mb" }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        return {
          token: req.headers.token,
          authScope: req.headers.authorization,
          //   dataSources: {
          //     pg: postgresql?.db,
          //     mongo: mongodb?.connection,
          //   },
          container: container,
        };
      },
    })
  );

  app.use(
    "/api/upload",
    upload.single("file"),
    (req, res) => {
      console.log("file", req.file)
      res.send('success')
    }
  );

  // Modified server startup
  await new Promise((resolve) =>
    httpServer.listen({ port: PORT_GRAPHQL }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT_GRAPHQL}/`);
};
