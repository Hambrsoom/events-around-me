import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import { createSchema } from "./utilities/server/createSechema";
import  config  from "../config/config";
import { runRedis } from "./redis-connection";
import { getUserIdFromJwt } from "./utilities/decoding-jwt";
import { validationRules } from "./utilities/server/queryComplexity";

const port: number = config.appPort || 5000;

async function main() {
  const schema = await createSchema();
  const app = Express();

  app.use("/images", Express.static("images"));
  app.use("*",cors());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      jwt: req.headers["authorization"],
      userId: req.headers["authorization"]? getUserIdFromJwt(req.headers["authorization"]): null
    }),
    debug: false,
    validationRules: validationRules
   });

   apolloServer.applyMiddleware({ app, path:"/graphql" });

  createConnection().then(async connection => {
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}/graphql`)
    );
  });
}

main();
runRedis();
