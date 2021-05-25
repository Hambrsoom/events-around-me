import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import Express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import  config  from "../config/config";
import { runRedis } from "./redis-connection";
import { getUserIdFromJwt } from "./utilities/decoding-jwt";
import logger from "./utilities/logger/logger";
import { createSchema } from "./utilities/server/createSechema";
import { validationRules } from "./utilities/server/queryComplexity";

const port: number = config.appPort || 5000;

async function main() {
  const schema = await createSchema();
  const app = Express();

  app.use("/images", Express.static("images"));
  app.use("*", cors());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      jwt: req.headers.authorization,
      userId: req.headers.authorization ? getUserIdFromJwt(req.headers.authorization) : null,
    }),
    debug: false,
    validationRules,
   });

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  createConnection().then(async (connection) => {
    app.listen(port, () =>
      logger.info({
        message: `Server is running on http://localhost:${port}/graphql`,
      }),
    );
  });
}

main();
runRedis();
