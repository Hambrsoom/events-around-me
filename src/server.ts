import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";

import { createSchema } from "./utilities/createSechema";
import  config  from "../config/config";
import { runRedis } from "./redis-connection";
import { getUserIdFromJwt } from "./utilities/decoding-jwt";

const port: number = config.appPort || 5000;

async function main() {
  const schema = await createSchema()
  const app = Express()

  app.use("/images", Express.static("images"));

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
      jwt: req.headers["authorization"],
      userId: req.headers["authorization"]? getUserIdFromJwt(req.headers["authorization"]): null
    }),
    debug: false
   });

  server.applyMiddleware({ app });

  createConnection().then(async connection => {
    app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}/graphql`)
    );
    });
}

main();
runRedis();
